
import { createClient } from '@supabase/supabase-js';

console.log('Initializing Supabase Service...');

// These should be in your .env file
// VITE_SUPABASE_URL=https://your-project-id.supabase.co
// VITE_SUPABASE_ANON_KEY=eyJhbG...

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Key is missing. Check your .env setup.');
}

export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        // Mock client to prevent crash if .env is missing
        auth: {
            signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase keys missing in .env' } }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        },
        from: () => ({
            select: () => Promise.resolve({ data: [], error: { message: 'Supabase keys missing' } }),
            insert: () => Promise.resolve({ error: { message: 'Supabase keys missing' } }),
            upload: () => Promise.resolve({ error: { message: 'Supabase keys missing' } }),
            getPublicUrl: () => ({ data: { publicUrl: '' } }),
            order: () => Promise.resolve({ data: [], error: { message: 'Supabase keys missing' } }),
        }),
        storage: {
            from: () => ({
                upload: () => Promise.resolve({ error: { message: 'Supabase keys missing' } }),
                getPublicUrl: () => ({ data: { publicUrl: '' } }),
            })
        }
    } as any;
