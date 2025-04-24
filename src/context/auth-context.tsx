import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ success: boolean; error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session and set up auth subscription
    const setupAuth = async () => {
      try {
        const { user: currentUser, error } = await getCurrentUser();
        
        if (error) {
          console.warn("Error getting current user:", error);
          if (error.message?.includes("supabaseUrl")) {
            setSupabaseError("Supabase connection issue. Demo mode active.");
          }
        }
        
        if (currentUser) {
          setUser(currentUser);
          
          // Fetch user profile data
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentUser.id)
              .single();
              
            if (profileError) {
              console.error('Error fetching profile:', profileError);
            } else {
              setProfile(profileData);
            }
          } catch (profileFetchError) {
            console.error('Error in profile fetch:', profileFetchError);
          }
        }
      } catch (error) {
        console.error('Error setting up auth:', error);
      } finally {
        setLoading(false);
      }
    };

    setupAuth();

    // Subscribe to auth changes with error handling
    let subscription;
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser(session.user);
            
            // Fetch user profile when auth state changes
            try {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (profileData) {
                setProfile(profileData);
              }
            } catch (profileError) {
              console.error('Error fetching profile on auth change:', profileError);
            }
          } else {
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
        }
      );
      subscription = data.subscription;
    } catch (subscribeError) {
      console.error('Error subscribing to auth changes:', subscribeError);
      setLoading(false);
    }

    return () => {
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from auth changes:', error);
        }
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: `Logged in successfully as ${data.user.email}`,
        });
        return { success: true, error: null };
      }
      
      return { success: false, error: new Error("Unknown error") };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }
      
      if (data.user) {
        // Create a profile record
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          name: userData.name,
          role: userData.role,
          email: email,
          enrollment_no: userData.enrollmentNo,
        });

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }

        toast({
          title: "Registration successful",
          description: "Your account has been created",
        });
        return { success: true, error: null };
      }
      
      return { success: false, error: new Error("Unknown error") };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {supabaseError ? (
        <div className="fixed inset-0 flex items-center justify-center bg-background z-50 p-4">
          <div className="max-w-md text-center p-6 rounded-lg border shadow-lg bg-card">
            <h2 className="text-2xl font-bold mb-4">Connection Issue</h2>
            <p className="mb-4">
              {supabaseError} You can still explore the app UI in demo mode.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              To enable full functionality, please set your Supabase credentials.
            </p>
            <button 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              onClick={() => {
                localStorage.setItem('user', JSON.stringify({
                  id: 'demo-user-id',
                  email: 'demo@example.com',
                  name: 'Demo User',
                  role: 'student'
                }));
                window.location.reload();
              }}
            >
              Continue in Demo Mode
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
