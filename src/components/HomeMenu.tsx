"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mobile, PC } from "./ResponsiveLayout";

export default function HomeMenu() {
  const pathName = usePathname();

  return (
    <div className="w-full mx-auto max-w-screen-xl pl-[40px]">
      <PC>
        <div className="flex justify-between items-center pt-[15px]">
          <nav className="flex gap-4">
            <Link
              href="/"
              className={`${
                pathName === null || pathName.startsWith("/")
                  ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]"
                  : ""
              } group hover:text-main-color pb-[6px]`}
            >
              홈
            </Link>
          </nav>
        </div>
      </PC>

      <Mobile>
        <div className="flex justify-center mt-12">
          <nav className="flex gap-5 font-bold text-lg">
            <Link
              href="/"
              className={`${
                pathName === null || pathName.startsWith("/")
                  ? "text-[#6D71E6]"
                  : ""
              } group hover:text-main-color`}
            >
              홈
            </Link>
          </nav>
        </div>
      </Mobile>
    </div>
  );
}
