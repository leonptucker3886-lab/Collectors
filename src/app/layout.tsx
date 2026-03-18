import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import { AuthProvider } from "../context/AuthContext";
import BottomNav from "../components/layout/BottomNav";
import AuthGuard from "../components/AuthGuard";
import { SpeedInsights } from "@vercel/speed-insights/next";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "CollectVault - Premium Collectors Network",
  description: "The premier platform for serious collectors",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${jetbrainsMono.variable} font-sans bg-[#0A0A0A] text-white`}>
        <AuthProvider>
          <AppProvider>
            <AuthGuard>
              {children}
              <BottomNav />
            </AuthGuard>
          </AppProvider>
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
