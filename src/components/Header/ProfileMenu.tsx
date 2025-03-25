"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GoGear, GoPersonAdd, GoBell } from "react-icons/go";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { IoCartOutline } from "react-icons/io5";
import axios from "axios";

interface ProfileMenuProps {
  session: Session | null;
  showProfileSettings: boolean;
  setShowProfileSettings: (show: boolean) => void;
  profileContainerRef: React.RefObject<HTMLDivElement | null>;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  notificationContainerRef: React.RefObject<HTMLDivElement | null>;
  setShowCart: (show: boolean) => void;
  cartItemCount: number;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  session,
  showProfileSettings,
  setShowProfileSettings,
  profileContainerRef,
  showNotifications,
  setShowNotifications,
  notificationContainerRef,
  setShowCart,
  cartItemCount,
}) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (session) {
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/usuario/notifications");
      const data = await response.data;
      if (data.status === "success") {
        setNotifications(data.data);
        setUnreadCount(data.data.filter((notif: any) => !notif.seen).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.patch("/api/usuario/notifications", { notificationId });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  if (session?.user?.role === "admin") {
    return (
      <div className="flex items-center space-x-4">
        {/* Notificações Admin */}
        <div className="relative" ref={notificationContainerRef}>
          <div
            className="cursor-pointer w-[3.3em] h-[3.3em] rounded-md shadow-md flex justify-center items-center"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <GoBell className="text-4xl" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-black text-[var(--primary)] rounded-full p-1 py-0.5 text-xs">
                {unreadCount}
              </span>
            )}
          </div>
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-md border border-gray-300 z-50 rounded-md">
              <ul>
                {notifications.length > 0 ? (
                  notifications.map((notif: any) => (
                    <li
                      key={notif.id}
                      className={`p-2 cursor-pointer ${
                        notif.seen ? "bg-gray-50" : "bg-white"
                      }`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      {notif.title}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">Não há notificações</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Dashboard Admin */}
        <Link
          href="/dashboard/"
          className="shadow-md rounded-md p-2 w-[3.3em] h-[3.3em] flex justify-center items-center transition-colors"
        >
          <GoGear className="text-4xl" />
        </Link>
      </div>
    );
  } else if (session?.user?.role === "user") {
    return (
      <div className="flex items-center space-x-4">
        {/* Perfil do Usuário */}
        <div className="relative">
          <div
            onClick={() => setShowProfileSettings(!showProfileSettings)}
            ref={profileContainerRef}
            className="cursor-pointer w-[3.3em] h-[3.3em] rounded-md shadow-md flex justify-center items-center transition-colors"
          >
            <Image
              width={35}
              height={35}
              src={session?.user?.image!}
              alt={session?.user?.name!}
              className="rounded-full border border-black shadow-md"
            />
          </div>
          {showProfileSettings && (
            <ul className="absolute top-full right-0 mt-2 w-48 bg-white shadow-md border border-gray-300 z-50 rounded-md overflow-hidden">
              <li className="line-clamp-1 p-2 underline decoration-[var(--primary)] bg-gray-50">
                {session?.user?.name}
              </li>
              <li className="p-2 hover:bg-gray-100">
                <Link href="/home/pedidos" className="block w-full">
                  Meus pedidos
                </Link>
              </li>
              <hr className="border border-gray-100" />
              <li className="p-2 hover:bg-gray-100">
                <button
                  onClick={() => {
                    signOut();
                    setShowProfileSettings(false);
                  }}
                  className="text-red-500 cursor-pointer hover:underline w-full text-left"
                >
                  Sair da conta
                </button>
              </li>
            </ul>
          )}
        </div>

        {/* Notificações Usuário */}
        <div className="relative" ref={notificationContainerRef}>
          <div
            className="cursor-pointer w-[3.3em] h-[3.3em] rounded-md shadow-md flex justify-center items-center transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <GoBell className="text-4xl" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </div>
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-md border border-gray-300 z-50 rounded-md">
              <ul>
                {notifications.length > 0 ? (
                  notifications.map((notif: any) => (
                    <li
                      key={notif.id}
                      className={`p-2 cursor-pointer ${
                        notif.seen ? "bg-gray-50" : "bg-white"
                      }`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      {notif.title}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">Não há notificações</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Carrinho */}
        <div className="relative">
          <button
            onClick={() => setShowCart(true)}
            className="cursor-pointer shadow-md rounded-md p-2 w-[3.3em] h-[3.3em] flex justify-center items-center transition-colors"
          >
            <IoCartOutline className="text-4xl" />
            <span className="absolute top-0 right-0 bg-black text-[var(--primary)] rounded-full p-1 py-0.5 text-xs">
              {cartItemCount}
            </span>
          </button>
        </div>
      </div>
    );
  } else {
    // Usuário não logado
    return (
      <Link
        href="/autenticar/login"
        className="shadow-md rounded-md p-2 w-[3.3em] h-[3.3em] flex justify-center items-center transition-colors"
      >
        <GoPersonAdd className="text-4xl" />
      </Link>
    );
  }
};

export default ProfileMenu;
