"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GoGear, GoPerson, GoPersonAdd } from "react-icons/go";
import { IoCartOutline } from "react-icons/io5";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="fixed w-full">
      <div className="w-full text-center text-[var(--primary)] bg-white font-bold">
        Ganhe 5% de desconto com pagamento via pix!
      </div>
      <div className="w-full bg-[var(--primary)] flex items-center justify-between">
        <div className="flex items-center">
          <Image
            quality={100}
            width={80}
            height={80}
            src="/logo.png"
            alt="logo perfumaria briatori essence"
          />
          <Image
            priority={true}
            quality={100}
            width={150}
            height={150}
            src="/logo1.png"
            alt="logo perfumaria briatori essence"
          />
        </div>
        <div></div>
        <div className="">
          <ul className="hidden md:flex justify-around">
            <li>
              {session?.user.role === "admin" && (
                <Link
                  href="/dashboard/"
                  className="transition-all hover:scale-110 me-5"
                >
                  <GoGear className="text-4xl" />
                </Link>
              )}
              {session?.user.role === "user" && (
                <Link
                  href="/minha-conta"
                  className="transition-all hover:scale-110 me-5"
                >
                  <GoPerson className="text-4xl" />
                </Link>
              )}
              {!session?.user && (
                <Link
                  href="/autenticar/login"
                  className="transition-all hover:scale-110 me-5"
                >
                  <GoPersonAdd className="text-4xl" />
                </Link>
              )}
            </li>
            <li>
              <Link
                href="/meu-carrinho"
                className="transition-all hover:scale-110 me-5"
              >
                <IoCartOutline className="text-4xl" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
