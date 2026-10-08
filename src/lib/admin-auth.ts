import { NextRequest } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

const ADMIN_EMAILS = [
  'admin@levelx3d.com',
  'nikhilmali007@gmail.com',
  'nikhil@levelx3d.com',
  'executive@levelx3d.com',
];

export async function verifyAdminRequest(req: NextRequest): Promise<{ authorized: boolean; error?: string }> {
  const adminKey = process.env.ADMIN_API_KEY || process.env.NEXT_PUBLIC_ADMIN_KEY || 'levelx3d-admin-2026';

  // Method 1: Check x-admin-key header (passkey auth)
  const headerKey = req.headers.get('x-admin-key');
  if (headerKey && headerKey === adminKey) {
    return { authorized: true };
  }

  // Method 2: Check Supabase session token for admin email
  if (isSupabaseConfigured) {
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (user && !error && user.email) {
          const email = user.email.toLowerCase();
          const isAdmin =
            ADMIN_EMAILS.includes(email) ||
            email.endsWith('@levelx3d.com') ||
            (user.user_metadata as any)?.role === 'admin';
          if (isAdmin) {
            return { authorized: true };
          }
        }
      } catch (e) {
        console.warn('Admin auth: Supabase token verification failed:', e);
      }
    }
  }

  return { authorized: false, error: 'Unauthorized. Provide a valid admin key or sign in with an admin account.' };
}
