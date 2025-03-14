import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/contexts/CartContext";

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
    <html lang="pt-br" suppressHydrationWarning={true}>
      <body className="antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
