import AntdProvider from '@/components/providers/AntdProvider';
import AuthInitializer from '@/components/providers/AuthInitializer';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Prueba Victor - Dashboard',
  description: 'Aplicación con Next.js 13+ y autenticación',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es'>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <AntdProvider>
          <AuthInitializer>{children}</AuthInitializer>
        </AntdProvider>
      </body>
    </html>
  );
}
