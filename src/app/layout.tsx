import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Crypte E-learning | PHILOSOPHE KASONGO",
  description: "Plateforme d'apprentissage en ligne de haute qualité par le philosophe Kasongo",
};

import { AuthProvider } from "@/components/providers/session-provider";
import Navbar from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

