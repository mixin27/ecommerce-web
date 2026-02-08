'use client';

import { useMutation } from '@apollo/client/react';
import { LogoutDocument } from '@/graphql/generated/graphql';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();
  const { logout: clearStore } = useAuthStore();
  const [logoutServer] = useMutation(LogoutDocument);

  const logout = async () => {
    try {
      await logoutServer();
    } catch (err) {
      console.error('Server logout failed', err);
    } finally {
      clearStore();
      router.push('/auth/login');
    }
  };

  return {
    logout,
  };
};
