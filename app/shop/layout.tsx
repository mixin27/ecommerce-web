'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@apollo/client/react';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, Heart, Package } from 'lucide-react';
import {
  GetMyCartDocument,
  GetMyCartQuery,
  UserRole,
} from '@/graphql/generated/graphql';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, logout, _hasHydrated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const { data: cartData } = useQuery<GetMyCartQuery>(GetMyCartDocument, {
    skip: !isAuthenticated,
    pollInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    // Wait for store to hydrate before redirecting
    if (!_hasHydrated) {
      return;
    }

    setIsLoading(false);

    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (
      user?.role === UserRole.Admin ||
      user?.role === UserRole.SuperAdmin
    ) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, user, router, _hasHydrated]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
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

  if (!isAuthenticated || user?.role !== UserRole.Customer) {
    return null;
  }

  const cartItemsCount = cartData?.myCart?.itemCount || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/shop" className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">ShopNow</h1>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/shop"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/shop/categories"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/shop/search"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Search
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/shop/wishlist">
                <Button variant="ghost" size="icon">
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/shop/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/shop/orders">
                <Button variant="ghost" size="icon">
                  <Package className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/shop/account">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>Contact</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Track Order</li>
                <li>Returns</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Policy</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Shipping Policy</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Facebook</li>
                <li>Instagram</li>
                <li>Twitter</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 ShopNow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
