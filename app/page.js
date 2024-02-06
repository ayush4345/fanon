"use client"

import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {

  const { user } = useUser()
  const router = useRouter()

  const redirectUser = () => {
    if (user) {
      router.push("/generate/story")
    } else {
      router.push("/api/auth/login")
    }
  }

  return (
    <main className="flex min-h-screen bg-[url(/comics_bg_3.jpg)] -mt-[72px] -z-1 flex-col items-center gap-16 justify-center p-24">
      <div className="font-[badaboom] text-[80px] text-gray-200 text-center">Let's create <br />your comic strip</div>
      <button onClick={redirectUser} class="relative inline-block px-4 py-2 font-medium group">
        <span class="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
        <span class="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
        <span class="relative text-black group-hover:text-white">Create Story</span>
      </button>
    </main>
  );
}
