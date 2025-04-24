
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

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const signUp = async (email: string, password: string, userData: any) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { data, error };
  } catch (err) {
    console.error("Sign up error:", err);
    return { data: null, error: err };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  } catch (err) {
    console.error("Sign in error:", err);
    return { data: null, error: err };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err) {
    console.error("Sign out error:", err);
    return { error: err };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return { user: null, error };
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    return { user, error: userError };
  } catch (err) {
    console.error("Get current user error:", err);
    return { user: null, error: err };
  }
};

// Database helpers
export const getRides = async () => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  } catch (err) {
    console.error("Get rides error:", err);
    return { data: null, error: err };
  }
};

export const getUserRides = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .or(`riders.cs.{${userId}},driver_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    return { data, error };
  } catch (err) {
    console.error("Get user rides error:", err);
    return { data: null, error: err };
  }
};

export const createRide = async (rideData: any) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .insert(rideData)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error("Create ride error:", err);
    return { data: null, error: err };
  }
};

export const updateRide = async (id: string, updateData: any) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error("Update ride error:", err);
    return { data: null, error: err };
  }
};
