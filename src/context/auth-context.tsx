'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { generateUUID } from '@/lib/supabase/orders';

export interface UserMetadata {
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: UserMetadata;
  created_at?: string;
}

export interface CustomerProfile {
  id: string;
  auth_user_id: string;
  name: string;
  phone: string;
  email: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  customer: CustomerProfile | null;
  isLoading: boolean;
  signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<{ user?: AuthUser; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ user?: AuthUser; error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<CustomerProfile>) => Promise<{ success: boolean; error?: string }>;
  refreshCustomer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'levelx3d_auth_user';
const LOCAL_ACCOUNTS_KEY = 'levelx3d_local_accounts';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch customer record linked to auth_user_id from Supabase
  const fetchCustomerProfile = async (authUserId: string, fallbackUser?: AuthUser): Promise<CustomerProfile | null> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('auth_user_id', authUserId)
          .maybeSingle();

        if (!error && data) {
          const profile: CustomerProfile = {
            id: data.id,
            auth_user_id: data.auth_user_id,
            name: data.name || fallbackUser?.user_metadata?.name || '',
            phone: data.phone || fallbackUser?.user_metadata?.phone || '',
            email: data.email || fallbackUser?.email || '',
            street: fallbackUser?.user_metadata?.street || '',
            city: fallbackUser?.user_metadata?.city || '',
            state: fallbackUser?.user_metadata?.state || 'Maharashtra',
            pincode: fallbackUser?.user_metadata?.pincode || '',
          };
          return profile;
        }
      } catch (err) {
        console.warn('Could not fetch customer profile from Supabase:', err);
      }
    }

    // Fallback: Construct profile from user metadata or local storage
    if (fallbackUser) {
      return {
        id: `cust-${fallbackUser.id.slice(0, 8)}`,
        auth_user_id: fallbackUser.id,
        name: fallbackUser.user_metadata?.name || fallbackUser.email.split('@')[0],
        phone: fallbackUser.user_metadata?.phone || '',
        email: fallbackUser.email,
        street: fallbackUser.user_metadata?.street || '',
        city: fallbackUser.user_metadata?.city || '',
        state: fallbackUser.user_metadata?.state || 'Maharashtra',
        pincode: fallbackUser.user_metadata?.pincode || '',
      };
    }

    return null;
  };

  // 2. Initialize Auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              user_metadata: session.user.user_metadata,
              created_at: session.user.created_at,
            };
            setUser(authUser);
            const cust = await fetchCustomerProfile(authUser.id, authUser);
            setCustomer(cust);
          }
        } catch (e) {
          console.warn('Error reading Supabase session:', e);
        }

        // Listen to Auth State Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              user_metadata: session.user.user_metadata,
              created_at: session.user.created_at,
            };
            setUser(authUser);
            const cust = await fetchCustomerProfile(authUser.id, authUser);
            setCustomer(cust);
          } else {
            setUser(null);
            setCustomer(null);
          }
        });

        setIsLoading(false);
        return () => subscription.unsubscribe();
      } else {
        // Offline / Sandbox Mode: Load from localStorage
        try {
          const storedUser = localStorage.getItem(LOCAL_USER_KEY);
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            const cust = await fetchCustomerProfile(parsed.id, parsed);
            setCustomer(cust);
          }
        } catch (e) {}
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const refreshCustomer = async () => {
    if (user) {
      const cust = await fetchCustomerProfile(user.id, user);
      setCustomer(cust);
    }
  };

  // 3. Sign Up
  const signUp = async (
    email: string,
    password: string,
    metadata?: UserMetadata
  ): Promise<{ user?: AuthUser; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              name: metadata?.name || '',
              phone: metadata?.phone || '',
              ...metadata,
            },
          },
        });

        if (error) {
          return { error: error.message };
        }

        if (data.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            user_metadata: data.user.user_metadata,
            created_at: data.user.created_at,
          };
          setUser(authUser);
          const cust = await fetchCustomerProfile(authUser.id, authUser);
          setCustomer(cust);
          return { user: authUser };
        }
      } catch (err: any) {
        return { error: err.message || 'Failed to sign up with Supabase' };
      }
    }

    // Demo / Offline Sign Up
    try {
      const accounts = JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_KEY) || '[]');
      const existing = accounts.find((a: any) => a.email === cleanEmail);
      if (existing) {
        return { error: 'An account with this email already exists.' };
      }

      const newUserId = generateUUID();
      const newUser: AuthUser = {
        id: newUserId,
        email: cleanEmail,
        user_metadata: metadata,
        created_at: new Date().toISOString(),
      };

      accounts.push({ ...newUser, password });
      localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser));

      setUser(newUser);
      const cust = await fetchCustomerProfile(newUser.id, newUser);
      setCustomer(cust);
      return { user: newUser };
    } catch (e: any) {
      return { error: e.message || 'Error creating account locally' };
    }
  };

  // 4. Sign In
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ user?: AuthUser; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          return { error: error.message };
        }

        if (data.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            user_metadata: data.user.user_metadata,
            created_at: data.user.created_at,
          };
          setUser(authUser);
          const cust = await fetchCustomerProfile(authUser.id, authUser);
          setCustomer(cust);
          return { user: authUser };
        }
      } catch (err: any) {
        return { error: err.message || 'Failed to sign in with Supabase' };
      }
    }

    // Demo / Offline Sign In
    try {
      const accounts = JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_KEY) || '[]');
      const account = accounts.find((a: any) => a.email === cleanEmail);

      let authUser: AuthUser;
      if (account) {
        authUser = {
          id: account.id,
          email: account.email,
          user_metadata: account.user_metadata,
          created_at: account.created_at,
        };
      } else {
        // Auto-provision demo account for rapid sandbox testing
        authUser = {
          id: generateUUID(),
          email: cleanEmail,
          user_metadata: { name: cleanEmail.split('@')[0] },
          created_at: new Date().toISOString(),
        };
        accounts.push({ ...authUser, password });
        localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
      }

      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(authUser));
      setUser(authUser);
      const cust = await fetchCustomerProfile(authUser.id, authUser);
      setCustomer(cust);
      return { user: authUser };
    } catch (e: any) {
      return { error: e.message || 'Error signing in' };
    }
  };

  // 5. Google Sign In
  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    if (isSupabaseConfigured) {
      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${origin}/account`,
          },
        });
        if (error) return { error: error.message };
        return {};
      } catch (err: any) {
        return { error: err.message || 'Failed to initiate Google OAuth' };
      }
    }

    // Demo / Offline Google Sign In
    const googleUser: AuthUser = {
      id: generateUUID(),
      email: 'collector.google@levelx3d.com',
      user_metadata: {
        name: 'Collector Google Member',
        phone: '9876543210',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      },
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(googleUser));
    setUser(googleUser);
    const cust = await fetchCustomerProfile(googleUser.id, googleUser);
    setCustomer(cust);
    return {};
  };

  // 6. Sign Out
  const signOut = async (): Promise<void> => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    localStorage.removeItem(LOCAL_USER_KEY);
    setUser(null);
    setCustomer(null);
  };

  // 7. Update Profile
  const updateProfile = async (data: Partial<CustomerProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not signed in' };

    const updatedProfile: CustomerProfile = {
      ...(customer || {
        id: `cust-${user.id.slice(0, 8)}`,
        auth_user_id: user.id,
        name: '',
        phone: '',
        email: user.email,
      }),
      ...data,
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('customers')
          .upsert({
            auth_user_id: user.id,
            name: updatedProfile.name,
            phone: updatedProfile.phone,
            email: updatedProfile.email,
          });

        if (error) {
          console.warn('Error updating Supabase customer record:', error);
        }
      } catch (e) {}
    }

    // Save locally
    const updatedUser: AuthUser = {
      ...user,
      user_metadata: {
        ...user.user_metadata,
        name: updatedProfile.name,
        phone: updatedProfile.phone,
        street: updatedProfile.street,
        city: updatedProfile.city,
        state: updatedProfile.state,
        pincode: updatedProfile.pincode,
      },
    };

    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
    setCustomer(updatedProfile);

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        customer,
        isLoading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        updateProfile,
        refreshCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
