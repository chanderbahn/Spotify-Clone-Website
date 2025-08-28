"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdHomeFilled } from "react-icons/md";
import { GoSearch } from "react-icons/go";
import useUserSession from "@/custom-hooks/useUserSession";
import logOutUser from "@/lib/auth/logOutUser";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const { session, loading } = useUserSession();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const result = await logOutUser();

    if (!result?.error) {
      router.push("/"); // ✅ redirect to homepage after logout
    } else {
      console.error("Logout failed:", result.error);
    }

    setLoggingOut(false);
  };

  return (
    <div>
      <nav className="h-15 flex justify-between items-center px-6 fixed top-0 left-0 w-full bg-black z-100">
        <div className="flex gap-6 items-center">
          <Image
            src="/images/logo.png"
            alt="logo-image"
            width={500}
            height={500}
            className="w-9 h-9"
          />

          <Link
            href="/"
            className="bg-background w-11 h-11 grid place-items-center text-white text-3xl rounded-full"
          >
            <MdHomeFilled />
          </Link>

          <div className="bg-background hidden lg:flex items-center h-11 w-90 px-3 gap-3 text-primary-text rounded-full">
            <GoSearch size={22} className="text-primary-text shrink-0" />
            <input
              className="h-full w-full outline-none placeholder:text-primary-text"
              type="text"
              placeholder="What do you want to play?"
            />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="lg:flex hidden gap-2 text-secondary-text font-bold border-r-2 border-primary-text pr-6">
            <a href="#" className="hover:text-primary-text">
              Premium
            </a>
            <a href="#" className="hover:text-primary-text">
              Support
            </a>
            <a href="#" className="hover:text-primary-text">
              Download
            </a>
          </div>

          <div>
            {!loading && (
              <>
                {session ? (
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className={`h-11 px-8 rounded-full font-bold grid place-items-center cursor-pointer ${
                      loggingOut
                        ? "bg-gray-400 text-gray-200"
                        : "bg-white text-gray-950 hover:bg-secondary-text"
                    }`}
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="h-11 bg-white text-gray-950 rounded-full font-bold hover:bg-secondary-text grid px-8 place-items-center"
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
