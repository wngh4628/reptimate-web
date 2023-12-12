"use client"
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { userAtom, isLoggedInState, chatVisisibleState } from "@/recoil/user";
import { Mobile, PC } from "@/components/ResponsiveLayout";

import  { useReGenerateTokenMutation } from "@/api/accesstoken/regenerate"
import Swal from "sweetalert2";

export default function ChatModal() {
    const setUser = useSetRecoilState(userAtom);
    const setIsLoggedIn = useSetRecoilState(isLoggedInState);
    const isLogin = useRecoilValue(isLoggedInState);

    const isChatVisisible = useRecoilValue(chatVisisibleState);
    const setIsChatVisisible = useSetRecoilState(chatVisisibleState);

    const reGenerateTokenMutation = useReGenerateTokenMutation();

    const router = useRouter();

    const [accessToken, setAccessToken] = useState("");
    const [password, setPassword] = useState("");

    const pathName = usePathname() || "";

    useEffect(() => {

    }, [pathName])

    const handleLogin = () => {
        const storedData = localStorage.getItem('recoil-persist');
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
    <div className={`${
        isChatVisisible ? "hidden" : ""
      } flex`}>
      <PC>
        <div className="bg-main-color fixed bottom-0 right-[10%] w-12 h-12">

        </div>
      </PC>

      <Mobile>
        <div className="bg-main-color ">

        </div>
      </Mobile>
    </div>
        
    
  );
}