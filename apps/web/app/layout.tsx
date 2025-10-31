import type { Metadata } from "next";
import { ResultsProvider } from "./context/ResultsContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlockSight",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark">
        <ResultsProvider>{children}</ResultsProvider>
      </body>
    </html>
  );
}
