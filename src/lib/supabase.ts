
import { createClient } from '@supabase/supabase-js';

// For development, we can use public placeholder values when environment variables are not set
// Replace these with your actual Supabase URL and anon key from your Supabase project
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Log warning if using placeholder values
if (supabaseUrl === 'https://placeholder-project.supabase.co' || 
    supabaseAnonKey === 'placeholder-anon-key') {
  console.warn('Using placeholder Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables for full functionality.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return { user: null, error };
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  return { user, error: userError };
};

// Database helpers
export const getRides = async () => {
  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getUserRides = async (userId: string) => {
  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .or(`riders.cs.{${userId}},driver_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createRide = async (rideData: any) => {
  const { data, error } = await supabase
    .from('rides')
    .insert(rideData)
    .select()
    .single();
  return { data, error };
};

export const updateRide = async (id: string, updateData: any) => {
  const { data, error } = await supabase
    .from('rides')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};
