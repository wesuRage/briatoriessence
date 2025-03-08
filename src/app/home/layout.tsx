import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";

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
        <AuthProvider>
          <Header userPage />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
