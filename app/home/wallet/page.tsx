'use client'

import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { useState } from "react";
import nacl from "tweetnacl";
import bs58 from 'bs58';
import { KeyIcon } from "lucide-react";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const seed_phrase_form = z.object({
    mnemonic: z.string()
});

type FormValues = z.output<typeof seed_phrase_form>;

const derivation_paths = {
    solana: "m/44'/501'/x'/0'",

}

type Wallet = {
    publickey: string,
    privatekey: string,
}[];

export default function Wallet(){
    const { toast } = useToast();
    const form_details = useForm<FormValues>({
        resolver: zodResolver(seed_phrase_form),
        defaultValues: {
            mnemonic: ""
        }
    });

    const [words, setWords] = useState<string[]>([]);
    const [mnemonic,setMnemonic] = useState<string>("");
    const [index,setIndex] = useState<number>(0);
    const [wallet,setWallet] = useState<Wallet>([]);

    function onSubmit(form_values: FormValues){
        let { mnemonic } = form_values;

        if(mnemonic.length === 0){
            mnemonic = createSeed();
        }

        setMnemonic(mnemonic);

        const words = mnemonic.split(" ");
        setWords(words);
    }

    async function generateWallet(){
        if(mnemonic.split(" ").length != 12){
            toast({
                variant: "destructive",
                title: "Invalid mnemonic",
                description: "Make sure to generate a seed phrase first!!"
            })

            return;
        }
        const seed = mnemonicToSeedSync(mnemonic);
        let path = derivation_paths.solana;
        let i = path.indexOf('x');
        let prev = path.substring(0,i);
        let next = path.substring(i+1);
        const derived_seed = derivePath(prev+`${index}`+next,seed.toString()).key;
        const keypair = nacl.sign.keyPair.fromSeed(derived_seed);
        const public_key = keypair.publicKey;
        const private_key = keypair.secretKey;

        setWallet((wallet) => [...wallet, {
            publickey: bs58.encode(public_key),
            privatekey: bs58.encode(private_key),
        }]);

        setIndex((index) => index+1);
    }

    const { control, handleSubmit, formState:{isDirty, isLoading, isSubmitting}} = form_details;

    return (
        <div className="w-full flex flex-col items-center space-y-12">
            <div className="w-full">
                <Form {...form_details}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex w-full justify-between items-center space-x-2">
                        <FormField
                        control={control}
                        name="mnemonic"
                        render={({field})=>(
                            <FormItem
                            className="w-full"
                            >
                                <Input
                                type="text"
                                {...field}
                                placeholder="Enter mnemonic or leave empty to generate seed."
                                />
                            </FormItem>
                        )}
                        />
                        <Button
                        type="submit"

                        >Add mnemonic</Button>
                        <Button
                        type="button"
                        onClick={generateWallet}
                        >
                        Generate wallet
                        </Button>
                        </div>
                    </form>
                </Form>
            </div>
            <div className="w-full">
                {
                    words.length > 0 && <div className="w-full grid grid-cols-4 gap-6 border-2 rounded-md p-4  ease-out duration-300 transition-all">
                    {
                        words.map((word)=>{
                            return(
                                <div 
                                key={word}
                                className="text-center bg-slate-300 dark:bg-slate-900 p-2 rounded-md">
                                    {word}
                                </div>
                            )
                        })
                    }
                </div>
                }
            </div>
            <div className="full">
                {
                    wallet.length > 0 && 
                    <div>
                        {
                            wallet.map((kp) => {
                                return (
                                    <div 
                                    className="text-center bg-slate-300 dark:bg-slate-900 p-4 m-4 border-2"
                                    key={kp.publickey}>
                                        <div className="flex space-x-4 my-2"><KeyIcon/><p>{kp.publickey}</p></div>
                                        <div className="flex space-x-4"><EyeClosedIcon/><p>{kp.privatekey}</p></div>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div>
        </div>
    )
}

function createSeed(){
    const words = generateMnemonic();
    return words;
}