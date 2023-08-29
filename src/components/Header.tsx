"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mobile, PC } from "./ResponsiveLayout";

export default function Header() {
  const login = false; // Set this to true or false based on your logic
  const pathName = usePathname() || "";
  const communityPathnames = [
    "/",
    "/community/used-deal",
    "/community/free",
    "/community/ask",
  ];
  return (
    <header>
      {/* PC 화면(반응형) */}
      <PC>
        <div className="flex justify-end pr-10 pt-5 gap-2 font-bold">
          {login ? (
            <Link href="/" className="group hover:text-main-color">
              로그아웃
            </Link>
          ) : (
            <>
              <Link href="/login" className="group hover:text-main-color">
                로그인
              </Link>
              <Link href="/join" className="group hover:text-main-color">
                회원가입
              </Link>
            </>
          )}
        </div>
        <div className="flex justify-between items-center pt-3 pl-10 pb-5 pr-10">
          <Link href="/">
            <div className="flex w-40">
              <img src="/img/main_logo.png" />
            </div>
          </Link>
          <nav className="flex gap-4 font-bold">
            <Link
              href="/"
              className={`${
                communityPathnames.includes(pathName) ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              COMMUNITY
            </Link>
            <Link
              href="/auction"
              className={`${
                pathName === "/auction" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              AUCTION
            </Link>
            <Link
              href="/my"
              className={`${
                pathName === "/my" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
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
        </div>
      </PC>
      {/* 모바일 화면(반응형) */}
      <Mobile>
        <div className="flex justify-end pt-2 pb-5 pr-5">
          <nav className="flex gap-4 font-bold">
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
        </div>
      </Mobile>
    </header>
  );
}
