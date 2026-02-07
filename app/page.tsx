'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { UserRole } from '@/graphql/generated/graphql';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for store to hydrate before redirecting
    if (!_hasHydrated) {
      return;
    }

    setIsLoading(false);

    if (!isAuthenticated) {
      router.push('/auth/login');
    } else {
      // Redirect based on user role
      if (user?.role === UserRole.SuperAdmin || user?.role === UserRole.Admin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/shop');
      }
    }
  }, [isAuthenticated, user, router, _hasHydrated]);

  if (isLoading || !_hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to E-Commerce</h1>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
