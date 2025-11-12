import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { ResultsProvider } from "./context/ResultsContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlockSight",
  description: "BlockSight is the AI-powered intelligence platform for DAOs and dApps. Turn complex on-chain data into actionable insights on user behavior, engagement, and growth. Join the waitlist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark">
        <ResultsProvider>
          {children}
        </ResultsProvider>
        <Toaster />
      </body>
    </html>
  );
}