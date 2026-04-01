import { Oswald, Work_Sans } from 'next/font/google';
import './globals.css';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-oswald',
});

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-work-sans',
});

export const metadata = {
  title: 'KFG Menu',
  description: 'Browse the KFG menu — burgers, chicken, sides and more',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${workSans.variable}`} style={{ fontFamily: 'var(--font-work-sans), sans-serif' }}>{children}</body>
    </html>
  );
}
