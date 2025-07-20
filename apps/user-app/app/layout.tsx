import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "../provider";
import { AppbarClient } from "./components/AppbarClient";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wallet",
  description: "Simple Wallet App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <html lang="en">
      <Providers>
        <body
          className={inter.className}
          suppressHydrationWarning={true}
        >
          <div className="min-w-screen min-h-screen bg-[#ebe6e6]">
            <AppbarClient />
            {children}
          </div>
        </body>
      </Providers>
    </html>
  );
}