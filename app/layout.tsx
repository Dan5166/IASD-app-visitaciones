"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { useUsers } from "@/hooks/useUsers";
import { redirect, usePathname } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useUsers();
  const pathName = usePathname();

  const authRoutes = ['/', '/sign-up', '/forgot-password'];
  const isInAuthRoute = authRoutes.includes(pathName);

  if(user && isInAuthRoute) {
    return redirect('/dashboard')
  }

  return (
    <html lang="es">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
