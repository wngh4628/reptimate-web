"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mobile, PC } from "./ResponsiveLayout";

export default function AiMenu(props:any) {

  const setFunctionList:((state:null) => void)[] = props.setFunctionList;

  const resetState = () => {
    setFunctionList.forEach(func => func(null));
    
  }

  const pathName = usePathname();
  return (
    <div>
      <PC>
        <div className="flex justify-between items-center pl-4">
          <nav className="flex gap-4 font-bold">
            <Link
              href="/ai/valueanalysis"
              className={`${
                  pathName === "/ai/valueanalysis" ? "text-[#6D71E6]" : ""
                } group hover:text-main-color`
              }
              onClick={resetState}
            >
              모프 가치 판단
            </Link>
            <Link
              href="/ai/linebreeding"
              className={`${
                pathName === "/ai/linebreeding" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
              onClick={resetState}
            >
              인공지능 브리딩 라인 추천
            </Link>
            <Link
              href="/ai/gender"
              className={`${
                pathName === "/ai/gender" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              암수 구분
            </Link>
            <Link
              href="/ai/virtualbreeding"
              className={`${
                pathName === "/ai/virtualbreeding" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              가상 브리딩
            </Link>
          </nav>
        </div>
      </PC>

      <Mobile>
        <div className="flex justify-center mt-2">
          <nav className="flex gap-4 font-bold text-lg">
            <Link
              href="/ai/valueanalysis"
              className={`${
                pathName === "/" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
              onClick={resetState}
            >
              모프 가치 판단
            </Link>
            <Link
              href="/ai/linebreeding"
              className={`${
                pathName === "/community/market" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              인공지능 브리딩 라인 추천
            </Link>
            <Link
              href="/ai/gender"
              className={`${
                pathName === "/community/free" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
              onClick={resetState}
            >
              암수 구분
            </Link>
            <Link
              href="/ai/virtualbreeding"
              className={`${
                pathName === "/community/ask" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              가상 브리딩
            </Link>
          </nav>
        </div>
      </Mobile>
    </div>
  );
}
