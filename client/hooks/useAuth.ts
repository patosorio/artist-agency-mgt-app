import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/lib/api';

interface User {
  id: number;
  email: string;
  tenant_id: number;
  is_active: boolean;
  is_superuser: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setState({ user: null, isLoading: false, error: null });
      return;
    }

    try {
      const response = await auth.me();
      setState({ user: response.data, isLoading: false, error: null });
    } catch (error) {
      setState({ user: null, isLoading: false, error: 'Authentication failed' });
      localStorage.removeItem('token');
    }
  };

  const login = async (email: string, password: string, subdomain: string) => {
    try {
      setState({ ...state, isLoading: true, error: null });
      const response = await auth.login(email, password, subdomain);
      localStorage.setItem('token', response.data.access_token);
      await checkAuth();
      router.push('/dashboard');
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Invalid email or password',
      });
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
    } finally {
      localStorage.removeItem('token');
      setState({ user: null, isLoading: false, error: null });
      router.push('/login');
    }
  };

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    checkAuth,
  };
} 