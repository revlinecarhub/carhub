import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { AppSidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "RevLine Hub",
  description: "Classeur de voitures d'exception",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} dark`}>
      <body className="min-h-screen">
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex min-h-screen flex-col">
              <header className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg)] px-3">
                <SidebarTrigger />
              </header>
              <main className="flex-1">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                  {children}
                </div>
              </main>
              <Footer />
            </SidebarInset>
            <Toaster richColors theme="dark" position="top-right" />
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
