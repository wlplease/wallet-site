import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center m-48">
      <div className="flex flex-col items-center space-y-12">
        <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight lg:text-7xl">
          Schools
        </h1>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Manage your wallets better
        </h2>
        <div>
          <Link href={"/home"}>
            <Button size={"lg"} variant={"outline"}>Start</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
