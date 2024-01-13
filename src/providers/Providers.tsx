"use client";
import { rentalABI, rentalContractAddress } from "@/contract/ContractInfo";
import { SmartContract, useContract } from "@thirdweb-dev/react";
import { BaseContract } from "ethers";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createContext, useState } from "react";

export { ThirdwebProvider } from "@thirdweb-dev/react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      {children}
    </NextThemesProvider>
  );
}

// export const ContractContext = createContext<
//   SmartContract<BaseContract> | undefined
// >(undefined);

// export function ContractProvider({ children }: { children: React.ReactNode }) {
//   const { contract } = useContract(rentalContractAddress, rentalABI);
//   return (
//     <ContractContext.Provider value={contract}>
//       {children}
//     </ContractContext.Provider>
//   );
// }
