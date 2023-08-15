"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathName = usePathname();
  const communityPathnames = [
    "/",
    "/community/used-deal",
    "/community/free",
    "/community/ask",
  ];
  return (
    <header className="flex justify-between items-center pt-10 pl-10 pb-5 pr-10">
      <Link href="/">
        <div className="flex w-40">
          <img src="/img/main_logo.png" />
        </div>
      </Link>
      <nav className="flex gap-4 font-bold">
        <Link
          href="/"
          className={
            communityPathnames.includes(pathName) ? "text-[#6D71E6]" : ""
          }
        >
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
        <Link href="">
          <div className="flex w-5 my-0.5">
            <img src="/img/chat.png" />
          </div>
        </Link>
        <Link href="">
          <div className="flex w-5 my-0.5">
            <img src="/img/notification.png" />
          </div>
        </Link>
        <Link href="">
          <div className="flex w-5 my-0.5">
            <img src="/img/search.png" />
          </div>
        </Link>
      </nav>
    </header>
  );
}
