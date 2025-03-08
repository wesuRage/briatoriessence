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

const menuItems = [
  { href: "/home/loja#sobre", label: "Sobre" },
  { href: "/home/loja#promoção", label: "Promoção" },
  { href: "/home/loja#feminino", label: "Feminino" },
  { href: "/home/loja#masculino", label: "Masculino" },
  { href: "/home/loja#decant", label: "Decant" },
  { href: "/home/loja#arabe", label: "Árabe" },
  { href: "/home/loja#hidratante", label: "Hidratante" },
  { href: "/home/loja#victoria", label: "Victoria's Secret" },
];

const allowedUrls = [
  "/home/loja#sobre",
  "/home/loja#promoção",
  "/home/loja#feminino",
  "/home/loja#masculino",
  "/home/loja#decant",
  "/home/loja#arabe",
  "/home/loja#hidratante",
  "/home/loja#victoria",
  "/home/dashboard/",
  "/home/minha-conta",
  "/autenticar/login",
];

interface HeaderProps {
  userPage?: boolean;
}

const Header: React.FC<HeaderProps> = ({ userPage }) => {
  const { data: session } = useSession();
  const [shrink, setShrink] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileContainerRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

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
        setShowProfileSettings(false);
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

  return (
    <header className="fixed w-full z-10">
      <section>
        {userPage && <AnnouncementBanner shrink={shrink} />}
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
                      0
                    </p>
                    <IoCartOutline className="text-4xl" />
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
      <CartModal
        showCart={showCart}
        setShowCart={setShowCart}
        cartRef={cartRef}
      />
      {userPage && (
        <section className="border-b border-gray-400 shadow-md text-sx">
          <NavigationMenu menuItems={menuItems} allowedUrls={allowedUrls} />
        </section>
      )}
    </header>
  );
};

export default Header;
