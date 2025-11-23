import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pixelar Web App',
  description: 'Pixelar Web Application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
