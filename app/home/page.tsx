'use client'

import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Wallet from "./wallet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Token from "./token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";


export default function Home(){
    const { connection } = useConnection();
    const wallet = useWallet();
    
    return (
        <div className="flex flex-col items-center mx-48 mt-24 space-y-12">
            <div className="flex justify-between w-full">
                {
                    wallet.connected === false ? <WalletMultiButton/>
                    : <WalletDisconnectButton/>
                }
            </div>
            <Tabs defaultValue="wallet" className="w-full ">
                <TabsList className="my-8">
                    <TabsTrigger value="wallet">Wallet</TabsTrigger>
                    <TabsTrigger value="token">Token Launcher</TabsTrigger>
                </TabsList>
                <TabsContent value="wallet">
                    <Wallet/>
                </TabsContent>
                <TabsContent value="token">
                    <Token/>
                </TabsContent>
            </Tabs>
        </div>
    )
}
