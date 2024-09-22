'use client'

import { z } from "zod";

import { 
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,CardFooter
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


const create_token_form = z.object({
  name: z.string().min(5),
  symbol: z.string().min(3),
  url: z.string().url(),
  init_supply: z.string().min(1)
});

type FormValue = z.output<typeof create_token_form>;

export default function Token(){

  const form = useForm<FormValue>({
    resolver: zodResolver(create_token_form),
    defaultValues: {
      name: "",
      symbol: "",
      url: "",
    },
    mode: "onChange"
  });

  const {control, formState:{isDirty, isSubmitting}, handleSubmit} = form;

  function on_submit(){}

  return (
      <div className='m-18 flex  flex-col items-center'>
      <h2 className="scroll-m-20 border-b pb-2 m-6 text-3xl font-semibold tracking-tight first:mt-0 ">
        Create a token
      </h2>
      <Card className='w-full p-6'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Fill in the details to join your peers! </CardDescription>
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
                     type = "file"
                     placeholder="Upload Image"
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
                  className='w-full my-2'>Create Token</Button>
                </CardFooter>
            </form>
          </Form>
    </Card>
  </div>
  )
}
