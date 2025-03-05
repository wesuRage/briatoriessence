import Main from "@/components/Main";
import Link from "next/link";

export default function NotFounds() {
  return (
    <Main>
        <section>
            <h1>Page Not Found</h1>
            <p>Sorry, the page you're looking for doesn't exist.</p>
            <Link prefetch={true} href="/">
                Back to Homepage
            </Link>
        </section>
    </Main>
  );
}
