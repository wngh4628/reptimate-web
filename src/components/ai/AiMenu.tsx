"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mobile, PC } from "../ResponsiveLayout";

export default function AiMenu(props: any) {
  // const setFunctionList: ((state: null) => void)[] = props.setFunctionList;

  // const resetState = () => {
  //   if(setFunctionList){
  //     setFunctionList.forEach((func) => func(null));
  //   }
  // };

  const pathName = usePathname();
  return (
    <div className="w-full mx-auto max-w-screen-xl pl-10">
      <PC>
        <div className="flex justify-between items-center pt-4">
          <nav className="flex gap-4">
            <Link
              href="/ai/valueanalysis"
              className={`${
                pathName === "/ai/valueanalysis" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
            >
              가치 판단
            </Link>
            <Link
              href="/ai/linebreeding"
              className={`${
                pathName === "/ai/linebreeding" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
              // onClick={resetState}
            >
              브리딩 추천
            </Link>
            <Link
              href="/ai/gender"
              className={`${
                pathName === "/ai/gender" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
              // onClick={resetState}
            >
              암수 구분
            </Link>
            <Link
              href="/ai/aibreeder"
              className={`${
                pathName === "/ai/aibreeder" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
            >
              사육 챗봇
            </Link>
          </nav>
        </div>
      </PC>

      <Mobile>
        <div className="flex justify mt-10 px-4 py-2 bg-gray-300">
          <nav className="flex gap-2 flex-col font-bold text-mg flex-auto">
            <Link
              href="/ai/valueanalysis"
              className={`${
                pathName === "/ai/valueanalysis" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
              // onClick={resetState}
            >
              가치 판단
            </Link>
            <Link
              href="/ai/linebreeding"
              className={`${
                pathName === "/ai/linebreeding" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
              // onClick={resetState}
            >
              라인 추천
            </Link>
          </nav>
          <nav className="flex gap-2 flex-col font-bold text-mg flex-auto">
            <Link
              href="/ai/gender"
              className={`${
                pathName === "/ai/gender" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              암수 구분
            </Link>
            <Link
              href="/ai/aibreeder"
              className={`${
                pathName === "/ai/aibreeder" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              사육 챗봇
            </Link>
          </nav>
        </div>

      </Mobile>
    </div>
  );
}
