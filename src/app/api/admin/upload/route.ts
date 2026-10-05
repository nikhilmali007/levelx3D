import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { slugify } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in form data.' },
        { status: 400 }
      );
    }

    const filename = `${Date.now()}-${slugify(file.name || 'product')}.jpg`;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filename, buffer, {
            contentType: file.type || 'image/jpeg',
            cacheControl: '3600',
            upsert: true,
          });

        if (!error && data) {
          const { data: publicData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filename);

          if (publicData?.publicUrl) {
            return NextResponse.json({
              success: true,
              url: publicData.publicUrl,
              filename,
            });
          }
        } else {
          console.warn('Supabase storage upload returned error:', error);
        }
      } catch (e) {
        console.warn('Supabase storage upload exception:', e);
      }
    }

    // Fallback: Convert to base64 Data URL so the product immediately displays high-res images
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      filename,
    });
  } catch (error: any) {
    console.error('Error handling image upload:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error processing image upload' },
      { status: 500 }
    );
  }
}
