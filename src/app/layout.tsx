import type { Metadata } from "next";
import { Afacad_Flux, Noto_Sans_Mono } from "next/font/google";

import { cn } from "@/lib/utils";

import "./globals.css";

const afacadFlux = Afacad_Flux({
  variable: "--font-afacad-flux",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const notoSansMono = Noto_Sans_Mono({
  variable: "--font-noto-sans-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  title: "SmartBuy",
  description: "Find everything you need to know before buying a product",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          afacadFlux.variable,
          notoSansMono.variable,
          "antialiased",
        )}
      >
        {children}
      </body>
    </html>
  );
}
