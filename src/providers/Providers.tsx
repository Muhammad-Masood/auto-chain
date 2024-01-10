"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export { ThirdwebProvider } from "@thirdweb-dev/react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      {children}
    </NextThemesProvider>
  );
}

export function ContractProvider({ children }: { children: React.ReactNode }) {}
