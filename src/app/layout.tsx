import type { Metadata } from "next";
import { Afacad_Flux, Noto_Sans_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

import "./globals.css";

const afacadFlux = Afacad_Flux({
  variable: "--font-afacad-flux",
  subsets: ["latin"],
});

const notoSansMono = Noto_Sans_Mono({
  variable: "--font-noto-sans-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Better Product",
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
