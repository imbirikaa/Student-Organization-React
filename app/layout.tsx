// app/layout.tsx or app/root-layout.tsx

import { Toaster } from "react-hot-toast";

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { AuthProvider } from "./context/auth-context";
import { PermissionsProvider } from "./context/permissions-context";
import BannerAd from "@/components/BannedAd";
import ScrollToTop from "@/components/scroll-to-top";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Öğrenci Teşkilatı",
  description: "Turkish campus community platform",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#111827] text-white`}>
        <Toaster position="top-right" reverseOrder={false} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <PermissionsProvider>
              <ScrollToTop />
              <Header />

              <main className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <BannerAd image="/images/bg.png" alt="Banner Ad 1" />
                    <BannerAd image="/images/bg.png" alt="Banner Ad 2" />
                  </div>
                </div>
                {children}
              </main>
            </PermissionsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
