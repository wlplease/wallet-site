import Link from "next/link";


type SidebarProps = {
    key: number,
    title: string,
    path: string,
}[];

const sidebar_props:SidebarProps = [
    {
        key: 1,
        title: "Create wallet",
        path: "/home/wallet"
    },
    {
        key: 2,
        title: "Launch token",
        path: "/home/token"
    },
    {
        key: 3,
        title: "Airdrop SOL",
        path: "/home/airdrop"
    }
]


export default function Sidebar(){
    return(
        <div className="flex flex-col divide-y">
            {
                sidebar_props.map((prop) => {
                    return(
                        <Link
                        key={prop.key}
                        href={prop.path}
                        className="h-[50px] pl-4 py-2 cursor-pointer rounded-md dark:hover:bg-gray-800 hover:bg-gray-500 ease-out transition-all duration-300"
                        >
                            {prop.title}
                        </Link>
                    )
                })
            }
        </div>
    )
}