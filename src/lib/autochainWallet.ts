// import { Connector, ConnectParams } from "@thirdweb-dev/wallets";
// import {
//   AbstractClientWallet,
//   WalletOptions,
// } from "../../node_modules/@thirdweb-dev/wallets/dist/declarations/src/evm/wallets/base";

// export class MyConnector extends Connector {
//   connect(options?: ConnectParams<TConnectParams>): Promise<string> {
//     // ...
//   }

//   disconnect(): Promise<void> {
//     // ...
//   }

//   getAddress(): Promise<string> {
//     // ...
//   }

//   getSigner(): Promise<Signer> {
//     // ...
//   }

//   getProvider(): Promise<providers.Provider> {
//     // ...
//   }

//   switchChain(chainId: number): Promise<void> {
//     // ...
//   }

//   isConnected(): Promise<boolean> {
//     // ...
//   }

//   setupListeners(): Promise<void> {
//     // ...
//   }

//   updateChains(chains: Chain[]): void {
//     // ...
//   }
// }

// export class AutoChainWallet extends AbstractClientWallet {
//   async getConnector(): Promise<Connector> {
//     return new MyConnector();
//   }
// }
