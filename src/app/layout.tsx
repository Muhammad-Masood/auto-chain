import "./globals.css";
import { Poppins } from "next/font/google";
import NavBar from "./components/Navbar";
import { ThemeProvider, ThirdwebProvider } from "@/providers/Providers";
import { Toaster } from "react-hot-toast";

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
        <ThemeProvider>
          <ThirdwebProvider activeChain="binance-testnet" clientId={process.env.CLIENT_KEY}>
            <Toaster position="top-center"/>
          <NavBar />
          {children}
          </ThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
