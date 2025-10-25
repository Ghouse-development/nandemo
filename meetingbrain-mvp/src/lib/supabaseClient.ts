import { createClient } from '@supabase/supabase-js';
import type { User } from './types';
import { mockAuth } from './mockAuth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

// Use mock if no real Supabase credentials
const isDemo = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co';

export const supabase = isDemo ? null : createClient(supabaseUrl, supabaseAnonKey);

/**
 * Check if user's email domain is allowed
 */
export const isAllowedDomain = (email: string): boolean => {
  const allowedDomain = import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN || 'g-house.co.jp';
  return email.endsWith(`@${allowedDomain}`);
};

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async () => {
  if (isDemo) {
    const result = await mockAuth.signInWithGoogle();
    if (result.error) throw result.error;
    return;
  }
  
  const { error } = await supabase!.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/library`,
    },
  });
  
  if (error) throw error;
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  if (isDemo) {
    const result = await mockAuth.signOut();
    if (result.error) throw result.error;
    return;
  }
  
  const { error } = await supabase!.auth.signOut();
  if (error) throw error;
};

/**
 * Get current user session
 */
export const getCurrentUser = async (): Promise<User | null> => {
  if (isDemo) {
    const { data: { session } } = await mockAuth.getSession();
    if (!session?.user) return null;
    
    return {
      id: session.user.id,
      email: session.user.email!,
      name: session.user.user_metadata?.full_name,
      avatar_url: session.user.user_metadata?.avatar_url,
    };
  }
  
  const { data: { session } } = await supabase!.auth.getSession();
  
  if (!session?.user) return null;
  
  return {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.user_metadata?.full_name,
    avatar_url: session.user.user_metadata?.avatar_url,
  };
};

/**
 * Check and enforce domain restriction
 */
export const checkDomainRestriction = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  
  if (!user) return false;
  
  if (!isAllowedDomain(user.email)) {
    await signOut();
    return false;
  }
  
  return true;
};