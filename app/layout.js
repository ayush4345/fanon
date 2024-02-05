"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { QueryClient, QueryClientProvider } from 'react-query';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {

  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <Navbar />
            {children}
          </UserProvider>
        </QueryClientProvider >
      </body>
    </html>
  );
}
