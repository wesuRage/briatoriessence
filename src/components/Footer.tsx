import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[var(--primary)] flex flex-col justify-center items-center border-t-2 border-[var(--primary)]">
      <div className="p-4 md:p-6 w-full bg-black"></div>
      <div>
        <Image
          width={150}
          height={150}
          draggable={false}
          src="/logo.png"
          alt="logo briatori essence"
          className="select-none"
        />
        <section></section>
      </div>
    </footer>
  );
}
