'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Folder,
  Bell,
  LogOut,
  BarChart3,
  FileText,
} from 'lucide-react';
import { UserRole } from '@/graphql/generated/graphql';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for store to hydrate before redirecting
    if (!_hasHydrated) {
      return;
    }

    setIsLoading(false);

    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (user?.role === UserRole.Customer) {
      router.push('/shop');
    }
  }, [isAuthenticated, user, router, _hasHydrated]);

  const handleLogout = () => {
    logout();
  };

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

  if (!isAuthenticated || user?.role === UserRole.Customer) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">{user?.name}</p>
        </div>
        <nav className="mt-6">
          <Link
            href="/admin/dashboard"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
          >
            <Package className="w-5 h-5 mr-3" />
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
          >
            <ShoppingCart className="w-5 h-5 mr-3" />
            Orders
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
          >
            <Folder className="w-5 h-5 mr-3" />
            Categories
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Analytics
          </Link>
          <Link
            href="/admin/reports"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
          >
            <FileText className="w-5 h-5 mr-3" />
            Reports
          </Link>
          {user?.role === UserRole.SuperAdmin && (
            <Link
              href="/admin/users"
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
            >
              <Users className="w-5 h-5 mr-3" />
              Users
            </Link>
          )}
          <Link
            href="/admin/notifications"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
          >
            <Bell className="w-5 h-5 mr-3" />
            Notifications
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
