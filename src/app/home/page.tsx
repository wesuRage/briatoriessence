"use client";

import Carousel from "@/components/Carousel";
import Main from "@/components/Main";
import { signOut } from "next-auth/react";

export default function Home() {
  const images = [
    "/banners/banner.jpeg",
    "/banners/banner2.jpg",
    "/banners/banner3.jpg",
    "/banners/banner4.webp",
    "/banners/banner5.webp",
  ];

  return (
    <Main>
      <Carousel images={images} />

      <button onClick={() => signOut()}>SAIR</button>
      <h1>oi</h1>
      <h1>oi</h1>
      <h1>oi</h1>
      <h1>oi</h1>
      <h1>oi</h1>
      <h1>oi</h1>
      <h1>oi</h1>
      <h1>oi</h1>
      <h1>oi</h1>
      <h1>oi</h1>
      <h1>oi</h1>
      <h1>oi</h1>
      <h1>oi</h1>
      <h1>oi</h1>
    </Main>
  );
}
