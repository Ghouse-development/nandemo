/**
 * Mock authentication for demo purposes
 * This replaces actual Supabase auth when environment variables are not set
 */

import type { User } from './types';

const MOCK_USER_KEY = 'mockUser';

// Auto-login demo user
const DEMO_USER: User = {
  id: 'demo-user-123',
  email: 'demo@g-house.co.jp',
  name: 'Demo User',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
};

// Automatically set demo user on initialization
if (typeof window !== 'undefined' && !localStorage.getItem(MOCK_USER_KEY)) {
  localStorage.setItem(MOCK_USER_KEY, JSON.stringify(DEMO_USER));
}

export const mockAuth = {
  async signInWithGoogle(): Promise<{ error?: Error }> {
    // Simulate Google sign in
    const mockUser: User = {
      id: 'mock-user-123',
      email: 'demo@g-house.co.jp',
      name: 'Demo User',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    };
    
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    return {};
  },

  async signOut(): Promise<{ error?: Error }> {
    localStorage.removeItem(MOCK_USER_KEY);
    return {};
  },

  async getSession(): Promise<{ data: { session: any } }> {
    const userStr = localStorage.getItem(MOCK_USER_KEY);
    if (!userStr) {
      return { data: { session: null } };
    }
    
    const user = JSON.parse(userStr);
    return {
      data: {
        session: {
          user: {
            id: user.id,
            email: user.email,
            user_metadata: {
              full_name: user.name,
              avatar_url: user.avatar_url,
            },
          },
        },
      },
    };
  },
};