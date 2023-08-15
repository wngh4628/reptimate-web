"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathName = usePathname();
  return (
    <header className="flex justify-between items-center p-4">
      <Link href="/">
        <div className="flex w-40">
          <img src="/img/main_logo.png" />
        </div>
      </Link>
      <nav className="flex gap-4 font-bold">
        <Link href="/" className={pathName === "/" ? "text-[#6D71E6]" : ""}>
          COMMUNITY
        </Link>
        <Link
          href="/auction"
          className={pathName === "/auction" ? "text-[#6D71E6]" : ""}
        >
          AUCTION
        </Link>
        <Link href="/my" className={pathName === "/my" ? "text-[#6D71E6]" : ""}>
          MY
        </Link>
      </nav>
    </header>
  );
}
