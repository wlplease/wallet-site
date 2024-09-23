'use client'

import { z } from "zod";

import { 
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,CardFooter
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { MINT_SIZE, TOKEN_PROGRAM_ID, getMinimumBalanceForRentExemptMint } from "@solana/spl-token"
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { createInitializeMintInstruction } from "@solana/spl-token";
import { useToast } from "@/hooks/use-toast";

const create_token_form = z.object({
  name: z.string().min(5),
  symbol: z.string().min(3),
  url: z.string().url(),
  init_supply: z.string().min(1)
});

type FormValue = z.output<typeof create_token_form>;

export default function Token(){

  const {toast} = useToast();

  const form = useForm<FormValue>({
    resolver: zodResolver(create_token_form),
    defaultValues: {
      name: "",
      symbol: "",
      url: "",
      init_supply: "1"
    },
    mode: "onChange"
  });

  const { control, formState:{isDirty, isSubmitting}, handleSubmit } = form;
  const { connection } = useConnection();
  const wallet  = useWallet();

  async function create_mint_transaction(){
    const min_lamports = await getMinimumBalanceForRentExemptMint(connection);
    const keypair = Keypair.generate();
    const TOKEN_ID = TOKEN_PROGRAM_ID;
    const {blockhash} = await connection.getLatestBlockhash();

    if(wallet.publicKey !== null)
    {
      try{
        const transaction = new Transaction().add(
          SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: keypair.publicKey,
            space: MINT_SIZE,
            lamports: min_lamports,
            programId: TOKEN_ID,
          }),
          createInitializeMintInstruction(
            keypair.publicKey,
            2,
            wallet.publicKey,
            wallet.publicKey,
            TOKEN_ID
          )
        );
  
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;
  
        transaction.partialSign(keypair);
        const resp = await wallet.signTransaction!(transaction);
        toast({
          title: "Transaction Success!",
          description:  `By public key ${resp.signatures[0].publicKey.toString()}`
        })
      }catch(err){
        console.log(err);
        toast({
          variant: "destructive",
          title: "Transaction failed",
        })
      }
    }
    
  }

  function on_submit(){
    create_mint_transaction();
  }

  return (
      <div className='m-18 flex  flex-col items-center'>
      <h2 className="scroll-m-20 border-b pb-2 m-6 text-3xl font-semibold tracking-tight first:mt-0 ">
        Solana Token Creator
      </h2>
      <Card className='w-full p-6'>
        <CardHeader>
          <CardTitle>Create a token</CardTitle>
          <CardDescription>Easily create your solana SPL token without coding!!</CardDescription>
        </CardHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(on_submit)}>
              <CardContent
              className="grid grid-cols-2 gap-4 space-x-2 "
              >
                <FormField
                control={control}
                name="name"
                render={({field})=>(
                 <FormItem>
                   <FormLabel>Name</FormLabel>
                   <FormControl>
                     <Input
                     type="text"
                     placeholder="Put the name of your token"
                     {...field}
                     />
                   </FormControl>
                   <FormMessage/>
                 </FormItem>
                )}
                />
                <FormField
                control={control}
                name="symbol"
                render={({field})=>(
                 <FormItem>
                   <FormLabel>Symbol</FormLabel>
                   <FormControl>
                     <Input
                     type="text"
                     placeholder="Put the symbol of your token"
                     {...field}
                     />
                   </FormControl>
                   <FormMessage/>
                 </FormItem>
                )}
                />
                <FormField
                control={control}
                name="url"
                render={({field})=>(
                 <FormItem>
                   <FormLabel>Image Url</FormLabel>
                   <FormControl>
                     <Input
                     type = "text"
                     placeholder="Add image URL"
                     {...field}
                     />
                   </FormControl>
                   <FormMessage/>
                 </FormItem>
                )}
                />
                <FormField
                control={control}
                name="init_supply"
                render={({field})=>(
                 <FormItem>
                   <FormLabel>Initial Supply</FormLabel>
                   <FormControl>
                     <Input
                     type = "text"
                     placeholder="Enter your initial supply"
                     {...field}
                     />
                   </FormControl>
                   <FormMessage/>
                 </FormItem>
                )}
                />
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button 
                  disabled = {
                    !isDirty || 
                    isSubmitting
                  }
                  type="submit"
                  className='w-1/4 my-2'>Create Token</Button>
                </CardFooter>
            </form>
          </Form>
    </Card>
  </div>
  )
}
