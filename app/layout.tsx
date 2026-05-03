import type { Metadata } from "next";
import { Inter, Playfair_Display, Bebas_Neue } from "next/font/google";
import { Toaster } from "sonner";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });

export const metadata: Metadata = {
  title: "RevLine Hub",
  description: "Classeur de voitures d'exception",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} ${bebas.variable} dark`}>
      <body className="flex min-h-screen flex-col">
        <TopNav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors theme="dark" position="top-right" />
      </body>
    </html>
  );
}
