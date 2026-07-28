import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="bg-gradient-to-r from-slate-500 to-red-600 w-fit px-7 py-3  rounded-3xl font-semibold transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-red-600 hover:to-zinc-600 hover:-translate-y-1 active:translate-y-0">
                home page
            </h1>



        </div>
    )
}
