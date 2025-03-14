"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { IoCartOutline } from "react-icons/io5";
import AnnouncementBanner from "./AnnouncementBanner";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import ProfileMenu from "./ProfileMenu";
import CartModal from "./CartModal";
import NavigationMenu from "./NavigationMenu";
import Skeleton from "react-loading-skeleton";
import { useCart } from "../contexts/CartContext";

const menuItems = [
  { href: "/home#sobre", label: "Sobre" },
  { href: "/home/loja/femininos", label: "Femininos" },
  { href: "/home/loja/masculinos", label: "Masculinos" },
  { href: "/home/loja/decants", label: "Decants" },
  { href: "/home/loja/perfumes-arabes", label: "Árabes" },
  { href: "/home/loja/hidratantes", label: "Hidratantes" },
  { href: "/home/loja/victorias-secret", label: "Victoria's Secret" },
];

const allowedUrls = [
  "/home#sobre",
  "/home/loja/femininos",
  "/home/loja/masculinos",
  "/home/loja/decants",
  "/home/loja/perfumes-arabes",
  "/home/loja/hidratantes",
  "/home/loja/victorias-secret",
  "/home/dashboard/",
  "/home/minha-conta",
  "/autenticar/login",
];

export default function Header() {
  const { data: session, status } = useSession();
  const [shrink, setShrink] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileContainerRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const { cartItemCount, setCartItemCount } = useCart();

  // Fecha o carrinho ao clicar fora
  useEffect(() => {
    const handleClickOutsideCart = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setShowCart(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideCart);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideCart);
  }, [showCart]);

  // Fecha o menu de perfil ao clicar fora
  useEffect(() => {
    const handleClickOutsideProfile = (event: MouseEvent) => {
      if (
        profileContainerRef.current &&
        !profileContainerRef.current.contains(event.target as Node)
      ) {
        setTimeout(() => setShowProfileSettings(false), 100);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideProfile);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideProfile);
  }, [showProfileSettings]);

  // Altera o header conforme o scroll
  useEffect(() => {
    const handleScroll = () => {
      setShrink(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showSearch) {
      searchInputRef.current?.focus();
    }
  }, [showSearch]);

  const fetchCartItemCount = async () => {
    if (session) {
      const response = await fetch("/api/usuario/carrinho");
      const data = await response.json();
      if (data.status === "success" && data.data) {
        const itemCount = data.data.products.reduce(
          (acc: number, item: any) => acc + item.quantidade,
          0
        );
        setCartItemCount(itemCount);
      }
    }
  };

  useEffect(() => {
    fetchCartItemCount();
  }, [session]);

  return (
    <header className="fixed w-full z-30">
      <section>
        <AnnouncementBanner shrink={shrink} />
        <div
          className={`transition-all select-none w-full bg-[var(--primary)] flex items-center justify-around border-b border-gray-400 ${
            shrink ? "max-h-16" : "max-h-24"
          }`}
        >
          <Logo shrink={shrink} searchOpen={searchOpen} />
          <SearchBar
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            searchInputRef={searchInputRef}
          />
          <div>
            {status != "loading" ? (
              <ul
                className={`flex justify-around items-center transition-all ${
                  searchOpen ? "scale-0" : "scale-100"
                }`}
              >
                <li className="relative right-2">
                  <ProfileMenu
                    session={session}
                    showProfileSettings={showProfileSettings}
                    setShowProfileSettings={setShowProfileSettings}
                    profileContainerRef={profileContainerRef}
                  />
                </li>
                {session?.user.role != "admin" && (
                  <li>
                    <button
                      onClick={() => setShowCart(true)}
                      className="md:me-5 cursor-pointer relative shadow-md rounded-md p-2"
                    >
                      <p className="absolute top-0 right-0 bg-black rounded-full text-[var(--primary)] p-1 text-sm/[8px]">
                        {cartItemCount}
                      </p>
                      <IoCartOutline className="text-4xl" />
                    </button>
                  </li>
                )}
              </ul>
            ) : (
              <div className="flex justify-around items-center gap-2">
                <Skeleton className="bg-[var(--primary)] text-[var(-- )] shadow-md rounded-md p-2 min-w-[3.3em] min-h-[3.3em] flex justify-center items-center" />
                <Skeleton className="bg-[var(--primary)] text-[var(-- )] shadow-md rounded-md p-2 min-w-[3.3em] min-h-[3.3em] flex justify-center items-center" />
              </div>
            )}
          </div>
        </div>
      </section>
      <CartModal
        showCart={showCart}
        setShowCart={setShowCart}
        cartRef={cartRef}
        fetchCartItemCount={fetchCartItemCount}
      />
      <section className="border-b text-nowrap border-gray-400 shadow-md text-sx">
        <NavigationMenu menuItems={menuItems} allowedUrls={allowedUrls} />
      </section>
    </header>
  );
}
