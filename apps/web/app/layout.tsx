import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { ResultsProvider } from "./context/ResultsContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlockSight",
  description: "BlockSight is the AI-powered intelligence platform for DAOs and dApps. Turn complex on-chain data into actionable insights on user behavior, engagement, and growth. Join the waitlist",
};

import { SessionProvider } from "@/components/auth/SessionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark">
        <SessionProvider>
          <ResultsProvider>
            {children}
          </ResultsProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}