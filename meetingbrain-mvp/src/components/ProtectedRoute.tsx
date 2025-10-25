import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, checkDomainRestriction } from '../lib/supabaseClient';
import type { User } from '../lib/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route wrapper that checks authentication and domain restriction
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [, setUser] = useState<User | null>(null);
  const [authorized, setAuthorized] = useState(false);

  // Skip authentication if VITE_SKIP_AUTH is set to 'true'
  const skipAuth = import.meta.env.VITE_SKIP_AUTH === 'true';

  useEffect(() => {
    if (skipAuth) {
      setAuthorized(true);
      setLoading(false);
    } else {
      checkAuth();
    }
  }, [skipAuth]);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        const isDomainAllowed = await checkDomainRestriction();
        
        if (isDomainAllowed) {
          setUser(currentUser);
          setAuthorized(true);
        } else {
          // Domain not allowed, user will be signed out
          setAuthorized(false);
        }
      } else {
        // In demo mode, auto-login is handled by mockAuth
        // Try to get user again after a brief delay
        setTimeout(async () => {
          const retryUser = await getCurrentUser();
          if (retryUser) {
            setUser(retryUser);
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
          setLoading(false);
        }, 100);
        return;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};