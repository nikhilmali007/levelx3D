import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { slugify } from '@/lib/supabase/admin';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { verifyAdminRequest } from '@/lib/admin-auth';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in form data.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 5MB limit.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, WEBP, and AVIF are allowed.' },
        { status: 400 }
      );
    }

    const originalName = file.name || 'product';
    const extension = originalName.split('.').pop() || 'jpg';
    const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    const filename = `${Date.now()}-${slugify(baseName)}.${extension}`;
    
    const buffer = Buffer.from(await file.arrayBuffer());

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filename, buffer, {
            contentType: file.type,
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

    // Fallback: Save to local filesystem
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'products');
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      console.warn('Error creating upload directory:', e);
    }
    
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/products/${filename}`,
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
