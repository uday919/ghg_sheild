import type { Metadata } from "next";
import { Syne, DM_Mono, Inter } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GHG Shield — GHG Compliance Done For You",
  description:
    "Full-service GHG compliance platform for California SB 253. ISO 14064 certified consultant managing emissions reporting for US mid-size companies.",
  keywords: ["GHG compliance", "SB 253", "ISO 14064", "carbon reporting", "greenhouse gas"],
};

import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${syne.variable} ${dmMono.variable} ${inter.variable} antialiased bg-[#0a0f0a] text-white font-[family-name:var(--font-inter)]`}
      >
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
