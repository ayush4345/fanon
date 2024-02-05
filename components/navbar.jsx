"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "./ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

const Navbar = () => {
  const router = useRouter();
  const { user } = useUser();

  return (
    <nav className="flex z-10 relative items-center bg-opacity-25 bg-gray-800 justify-between p-4 px-8">
      <Link href="/">
        <h1 className=" text-3xl font-[Brootahh] text-black">Fanon</h1>
      </Link>
      <ul className="flex list-none items-center">
        {user ? (
          <li className="ml-4 flex gap-4 items-center">
            <Button
              onClick={() => router.push("/api/auth/logout")}
              className="rounded-lg px-4 py-2 font-semibold text-white transition duration-300 ease-in-out"
            >
              Logout
            </Button>
            <Link href="/profile">
              <Avatar className="w-12 h-12">
                <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed={user?.name}`} alt="user" />
                <AvatarFallback>FN</AvatarFallback>
              </Avatar>
            </Link>
          </li>
        ) : (
          <li className="ml-4">
            <Button
              onClick={() => router.push("/api/auth/login")}
              className=" rounded-lg px-4 py-2 font-semibold text-white transition duration-300 ease-in-out"
            >
              Login
            </Button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
