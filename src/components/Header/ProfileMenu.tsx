"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { GoGear, GoPersonAdd } from "react-icons/go";
import { Session } from "next-auth";

interface ProfileMenuProps {
  session: Session | null;
  showProfileSettings: boolean;
  setShowProfileSettings: (show: boolean) => void;
  profileContainerRef: React.RefObject<HTMLDivElement | null>;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  session,
  showProfileSettings,
  setShowProfileSettings,
  profileContainerRef,
}) => {
  if (session?.user?.role === "admin") {
    return (
      <Link href="/dashboard/" className=" shadow-md rounded-md p-2 w-[3.3em] h-[3.3em] flex justify-center items-center">
        <GoGear className="text-4xl" />
      </Link>
    );
  } else if (session?.user?.role === "user") {
    return (
      <>
        <div
          onClick={() => setShowProfileSettings(!showProfileSettings)}
          ref={profileContainerRef}
          className="select-none relative left-[3.35rem] cursor-pointer w-[3.3em] h-[3.3em] rounded-md shadow-md flex flex-col justify-center items-center"
        >
          <Image
            width={35}
            height={35}
            src={session?.user?.image!}
            alt={session?.user?.name!}
            className="rounded-full border-2 border-black shadow-md"
          />
        </div>
        <div className="min-w-[150px]">
          <ul
            className={`${
              showProfileSettings ? "scale-100 right-11 top-12" : "right-0 top-0 scale-0"
            } transition-all absolute w-full bg-white shadow-md border border-gray-300 mt-2`}
          >
            <li className="line-clamp-1 p-2 underline decoration-[var(--primary)]">{session?.user?.name}</li>
            <li className="line-clamp-1 p-2">{session?.user?.name}</li>
          </ul>
        </div>
      </>
    );
  } else {
    return (
      <Link
        href="/autenticar/login"
        className="md:me-5 shadow-md rounded-md p-2 w-[3.3em] h-[3.3em] flex justify-center items-center"
      >
        <GoPersonAdd className="text-4xl" />
      </Link>
    );
  }
};

export default ProfileMenu;
