import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ApolloWrapper } from '@/components/providers/apollo-wrapper';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'E-Commerce App',
  description: 'Full-featured e-commerce application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <ApolloWrapper>{children}</ApolloWrapper>
        <Toaster />
      </body>
    </html>
  );
}
