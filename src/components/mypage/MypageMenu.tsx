"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { userAtom, isLoggedInState } from "@/recoil/user";
import { Mobile, PC } from "@/components/ResponsiveLayout";

import { useReGenerateTokenMutation } from "@/api/accesstoken/regenerate";
import Swal from "sweetalert2";

export default function MypageMenu() {
  const setUser = useSetRecoilState(userAtom);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const isLogin = useRecoilValue(isLoggedInState);

  const reGenerateTokenMutation = useReGenerateTokenMutation();

  const router = useRouter();

  const [accessToken, setAccessToken] = useState("");
  const [password, setPassword] = useState("");
  const [warningMsg, setWarningMsg] = useState(false);

  const pathName = usePathname() || "";

  useEffect(() => {
    handleLogin();
  }, [pathName]);

  const handleLogin = () => {
    const storedData = localStorage.getItem("recoil-persist");
    if (storedData) {
      const userData = JSON.parse(storedData);
      if (userData.USER_DATA.accessToken) {
        setAccessToken(userData.USER_DATA.accessToken);
      }
    } else {
      router.replace("/");
      Swal.fire({
        text: "로그인이 필요한 기능입니다.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
    }
  };

  return (
    <div className="flex">
      <PC>
        <div className="flex w-[235px] drop-shadow-md">
          <nav className="flex flex-col font-bold w-full">
            <Link
              href="/my"
              className={`${
                pathName === "/my"
                  ? "bg-[#6D71E6] text-white"
                  : "hover:text-[#6D71E6] bg-white"
              } group  border-b-[1px] h-[60px] flex items-center pl-2`}
            >
              내 정보 수정
            </Link>
            <Link
              href="/my/board"
              className={`${
                pathName === "/my/board"
                  ? "bg-[#6D71E6] text-white"
                  : "hover:text-[#6D71E6] bg-white"
              } group border-b-[1px] h-[60px] flex items-center pl-2`}
            >
              내가 쓴 글
            </Link>
            <Link
              href="/my/auction"
              className={`${
                pathName === "/my/auction"
                  ? "text-white bg-[#6D71E6]"
                  : "hover:text-[#6D71E6] bg-white"
              } group border-b-[1px] h-[60px] flex items-center pl-2`}
            >
              내 경매
            </Link>
            <Link
              href="/my/bookmark"
              className={`${
                pathName === "/my/bookmark"
                  ? "text-white bg-[#6D71E6]"
                  : "hover:text-[#6D71E6] bg-white"
              } group  h-[60px] flex items-center pl-2`}
            >
              북마크
            </Link>
            <Link
              href="/my/valueanalysisresults"
              className={`${
                pathName === "/my/valueanalysisresults"
                  ? "text-white bg-[#6D71E6]"
                  : "hover:text-[#6D71E6] bg-white"
              } group  h-[60px] flex items-center pl-2`}
            >
              가치판단 결과
            </Link>
          </nav>
        </div>
      </PC>

      <Mobile>
        <div className="flex mb-[25px] drop-shadow-md items-center justify-center content-center m-auto w-full border-[1px] mt-12">
          <nav className="flex font-bold w-full">
            <Link
              href="/my/board"
              className={`${
                pathName === "/my/board"
                  ? "bg-[#6D71E6] text-white"
                  : "hover:text-[#6D71E6]"
              } group  h-[50px] flex items-center justify-center text-center px-2 border-r-[1px] w-1/3 text-[13px]`}
            >
              내가 쓴 글
            </Link>
            <Link
              href="/my/auction"
              className={`${
                pathName === "/my/auction"
                  ? "bg-[#6D71E6] text-white"
                  : "hover:text-[#6D71E6]"
              } group  h-[50px] flex items-center justify-center text-center px-5 border-r-[1px] w-1/3 text-[13px]`}
            >
              내 경매
            </Link>
            <Link
              href="/my/bookmark"
              className={`${
                pathName === "/my/bookmark"
                  ? "bg-[#6D71E6] text-white"
                  : "hover:text-[#6D71E6] "
              } group  h-[50px] flex items-center justify-center text-center px-5 w-1/3 text-[13px]`}
            >
              북마크
            </Link>
            <Link
              href="/my/valueanalysisresults"
              className={`${
                pathName === "/my/valueanalysisresults"
                  ? "bg-[#6D71E6] text-white"
                  : "hover:text-[#6D71E6] "
              } group  h-[50px] flex items-center justify-center text-center px-5 w-1/3 text-[13px]`}
            >
              가치판단 결과
            </Link>
          </nav>
        </div>
      </Mobile>
    </div>
  );
}
