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
import { Badge } from "@/components/ui/badge";

const seed_phrase_form = z.object({
    mnemonic: z.string()
});

type FormValues = z.output<typeof seed_phrase_form>;

const derivation_paths = {
    solana: "m/44'/501'/x'/0'",

}

export default function Home(){
    const form_details = useForm<FormValues>({
        resolver: zodResolver(seed_phrase_form),
        defaultValues: {
            mnemonic: ""
        }
    });

    const [words, setWords] = useState<string[]>([]);

    function onSubmit(form_values: FormValues){
        let { mnemonic } = form_values;

        if(mnemonic.length === 0){
            mnemonic = createSeed();
        }

        const words = mnemonic.split(" ");
        setWords(words);
    }

    const { control, handleSubmit, formState:{isDirty, isLoading, isSubmitting}} = form_details;

    return (
        <div className="flex flex-col items-center mx-48 mt-24 space-y-12">
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

                        >Add</Button>
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
                                <div className="text-center bg-slate-300 dark:bg-slate-900 p-2 rounded-md">
                                    {word}
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