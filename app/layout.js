"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { QueryClient, QueryClientProvider } from 'react-query';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {

  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <DndProvider backend={HTML5Backend}>
              <Navbar />
              {children}
            </DndProvider>
          </UserProvider>
        </QueryClientProvider >
      </body>
    </html>
  );
}
