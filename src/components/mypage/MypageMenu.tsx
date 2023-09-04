"use client"
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { getAccountInfo } from "@/api/my/info";
import { userAtom, isLoggedInState } from "@/recoil/user";
import { Mobile, PC } from "@/components/ResponsiveLayout";

import  { useReGenerateTokenMutation } from "@/api/accesstoken/regenerate"

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
    }, [pathName])

    const handleLogin = () => {
        const storedData = localStorage.getItem('recoil-persist');
        if (storedData) {
            const userData = JSON.parse(storedData);
            if (userData.USER_DATA.accessToken != null) {
                setAccessToken(userData.USER_DATA.accessToken);
            }
        }
    };
    

    
    
  return (
    <div className="flex">
      <PC>
        <div className="flex w-[235px] drop-shadow">
          <nav className="flex flex-col font-bold w-full">
            <Link
              href="/my"
              className={`${
                pathName === "/my" ? "bg-[#6D71E6] text-white" : "hover:text-[#6D71E6]"
              } group bg-white border-b-[1px] h-[60px] flex items-center pl-2`}
            >
              내 정보 수정
            </Link>
            <Link
              href="/my/board"
              className={`${
                pathName === "/my/board" ? "text-white bg-main-color" : "hover:text-[#6D71E6]"
              } group  bg-white border-b-[1px] h-[60px] flex items-center pl-2`}
            >
              내가 쓴 글
            </Link>
            <Link
              href="/my/auction"
              className={`${
                pathName === "/my/auction" ? "text-[#6D71E6]" : "hover:text-[#6D71E6]"
              } group  bg-white border-b-[1px] h-[60px] flex items-center pl-2`}
            >
              내 경매
            </Link>
            <Link
              href="/my/bookmark"
              className={`${
                pathName === "/my/bookmark" ? "text-[#6D71E6]" : "hover:text-[#6D71E6]"
              } group  bg-white h-[60px] flex items-center pl-2`}
            >
              북마크
            </Link>
          </nav>
        </div>
      </PC>

      <Mobile>
        <div className="flex mb-[25px] drop-shadow-sm items-center justify-center content-center m-auto w-full">
            <nav className="flex font-bold w-full">
                <Link
                  href="/my"
                  className={`${
                    pathName === "/my" ? "bg-[#6D71E6] text-white" : "hover:text-[#6D71E6] "
                  } group  bg-white h-[50px] flex items-center justify-center text-center px-5 border-r-[1px] w-1/4`}
                >
                  내 정보 수정
                </Link>
                <Link
                  href="/my/board"
                  className={`${
                    pathName === "/my/board" ? "bg-[#6D71E6] text-white" : "hover:text-[#6D71E6]"
                  } group  bg-white h-[50px] flex items-center justify-center text-center px-5 border-r-[1px] w-1/4`}
                >
                  내가 쓴 글
                </Link>
                <Link
                  href="/my/free"
                  className={`${
                    pathName === "/my/auction" ? "bg-[#6D71E6] text-white" : "hover:text-[#6D71E6]"
                  } group  bg-white h-[50px] flex items-center justify-center text-center px-5 border-r-[1px] w-1/4`}
                >
                  내 경매
                </Link>
                <Link
                  href="/my/bookmark"
                  className={`${
                    pathName === "/my/bookmark" ? "bg-[#6D71E6] text-white" : "hover:text-[#6D71E6]"
                  } group  bg-white h-[50px] flex items-center justify-center text-center px-5 w-1/4`}
                >
                  북마크
                </Link>
            </nav>
        </div>
      </Mobile>
    </div>
        
    
  );
}