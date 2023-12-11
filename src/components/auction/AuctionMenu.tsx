"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mobile, PC } from "../ResponsiveLayout";

export default function AiMenu(props: any) {

  const pathName = usePathname();
  return (
    <div className="w-full mx-auto max-w-screen-xl pl-[40px]">
      <PC>
        <div className="flex justify-between items-center pt-[15px]">
          <nav className="flex gap-4">
            <Link
              href="/auction"
              className={`${
                pathName === "/auction" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
            >
              진행중
            </Link>
            <Link
              href="/auction"
              className={`${
                pathName === "/ai/linebreeding" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
              // onClick={resetState}
            >
              종료
            </Link>
          </nav>
        </div>
      </PC>

      <Mobile>
        <div className="flex justify mt-10 px-4 py-2 bg-gray-300">
          <nav className="flex gap-2 flex-col font-bold text-mg flex-auto">
            <Link
              href="/auction"
              className={`${
                pathName === "/ai/valueanalysis" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
              // onClick={resetState}
            >
              진행중
            </Link>
            <Link
              href="/auction"
              className={`${
                pathName === "/ai/linebreeding" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
              // onClick={resetState}
            >
              종료
            </Link>
          </nav>
        </div>
      </Mobile>
    </div>
  );
}
