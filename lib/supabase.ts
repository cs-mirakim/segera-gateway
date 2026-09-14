/**
 * SEGERA Supabase PostGIS Client
 * Free tier Supabase client for reading cached geospatials with RLS read-only.
 */

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase client instance will be initialized when credentials are provided in .env.local
