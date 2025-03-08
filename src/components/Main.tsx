interface MainProps {
    children: React.ReactNode;
    noSpace?: boolean;
}

export default function Main({children, noSpace}: MainProps) {
    return (
        <main className="p-4">
            <div className={`${ noSpace? "" : "mt-[134px]"}`}></div>
            {children}
        </main>
    );
}