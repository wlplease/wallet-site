'use client'
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import "@solana/wallet-adapter-react-ui/styles.css";

export default function Provider({children}: {children: React.ReactNode}){
    const url = process.env.NEXT_PUBLIC_RPC_URL!;
    return (
        <ConnectionProvider endpoint={url}>
            <WalletProvider wallets={[]} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}