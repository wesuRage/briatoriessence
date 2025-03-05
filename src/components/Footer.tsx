import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[var(--primary)] p-4 md:p-6 flex flex-col justify-center items-center">
            <Image width={150} height={150} src="/logo.png" alt="logo briatori essense"/>
            <section>
            
            </section>
        </footer>
    )
}