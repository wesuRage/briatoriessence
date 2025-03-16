import type { Metadata } from "next";
import "../../globals.css";
import Main from "@/components/Main";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Briatori Essense - Perfumaria Online",
  description: "A sua essência à um clique de distância",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Main>
      <Script src="https://sdk.mercadopago.com/js/v2"></Script>
      {children}
    </Main>
  );
}
