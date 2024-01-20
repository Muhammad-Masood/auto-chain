"use client"
import "./globals.css";
import NavBar from "./components/Navbar";
import { ThemeProvider, ThirdwebProvider } from "@/providers/Providers";
import { Toaster } from "react-hot-toast";
import { metamaskWallet } from "@thirdweb-dev/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Auto Chain</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="xl:px-[4rem]">
        <ThemeProvider>
          <ThirdwebProvider
            activeChain="binance-testnet"
            clientId={process.env.NEXT_PUBLIC_CLIENT_KEY}
            secretKey={process.env.SECRET_KEY}
            supportedWallets={[metamaskWallet()]}
          >
            <Toaster position="top-center" />
            <NavBar />
            {children}
          </ThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
