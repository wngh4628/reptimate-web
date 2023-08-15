import Link from "next/link";

export default function Header() {
  return (
    <header>
      <Link href="/">
        <h1>{"ReptiMate"}</h1>
      </Link>
      <nav>
        <Link href="/">COMMUNITY</Link>
        <Link href="/auction">AUCTION</Link>
        <Link href="/my">MY</Link>
      </nav>
    </header>
  );
}
