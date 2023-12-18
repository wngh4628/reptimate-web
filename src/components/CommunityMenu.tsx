"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mobile, PC } from "./ResponsiveLayout";

export default function CommunityMenu() {
  const pathName = usePathname();

  return (
    <div className="w-full mx-auto max-w-screen-xl pl-[40px]">
      <PC>
        <div className="flex justify-between items-center pt-[15px]">
          <nav className="flex gap-4">
            <Link
              href="/community/adoption"
              className={`${
                pathName === null || pathName.startsWith("/community/adoption")
                  ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]"
                  : ""
              } group hover:text-main-color pb-[6px]`}
            >
              분양글
            </Link>
            <Link
              href="/community/market"
              className={`${
                pathName && pathName.startsWith("/community/market") ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
            >
              중고 거래
            </Link>
            <Link
              href="/community/free"
              className={`${
                pathName && pathName.startsWith("/community/free") ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
            >
              자유 게시판
            </Link>
            <Link
              href="/community/ask"
              className={`${
                pathName && pathName.startsWith("/community/ask") ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
            >
              질문 게시판
            </Link>
          </nav>
        </div>
      </PC>

      <Mobile>
        <div className="flex justify-center mt-12">
          <nav className="flex gap-5 font-bold text-lg">
            <Link
              href="/community/adoption"
              className={`${
                pathName === null || pathName.startsWith("/community/adoption")
                  ? "text-[#6D71E6]"
                  : ""
              } group hover:text-main-color`}
            >
              분양글
            </Link>
            <Link
              href="/community/market"
              className={`${
                pathName === "/community/market" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              중고 거래
            </Link>
            <Link
              href="/community/free"
              className={`${
                pathName === "/community/free" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              자유 게시판
            </Link>
            <Link
              href="/community/ask"
              className={`${
                pathName === "/community/ask" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              질문 게시판
            </Link>
          </nav>
        </div>
      </Mobile>
    </div>
  );
}
