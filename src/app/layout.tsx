import Navbar from '@/components/nav/Navbar';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Match Zone',
  description: 'دوستانتان را برای رقابت های بزرگ پیدا کنید',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='fa' dir='rtl'>
      <body className='min-h-screen bg-[#0A0A0A] text-[#DDDDDD]'>
      <Navbar />
        {children}
      </body>
    </html>
  );
}