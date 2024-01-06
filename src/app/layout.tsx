"use client";
import "./globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Poppins } from "next/font/google";
import NavBar from "./components/Navbar";

export const poppins = Poppins({
  weight: "700",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Auto Chain</title>
      </head>
      <body className="xl:px-[4rem]">
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <NavBar />
          {children}
        </NextThemesProvider>
      </body>
    </html>
  );
}
