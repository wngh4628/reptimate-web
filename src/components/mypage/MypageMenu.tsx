"use client"
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useSetRecoilState } from "recoil";

import { getAccountInfo } from "@/api/my/info";
import { userAtom } from "@/recoil/user";

import  { reGenerateTokenMutation } from "@/api/accesstoken/regenerate"

export default function MypageMenu() {
    const setUser = useSetRecoilState(userAtom);
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
    
    const mutation = useMutation({
        mutationFn: getAccountInfo,
        onSuccess: (data) => {
            var a = JSON.stringify(data.data);
            var result = JSON.parse(a);
            var b = JSON.stringify(result.result);
            var result = JSON.parse(b);
            
        },
        onError: (err: { response: { status: number } }) => {
            if(err.response.status < 600) {
                setWarningMsg(true);
            }
            if(err.response.status == 401) {
                reGenerateTokenMutation.mutate({
                    refreshToken: ""
                }, {
                    onSuccess: () => {
                      mutation.mutate({
                          accessToken: accessToken
                      });
                    },
                    onError: () => {
                        router.replace("/");
                        alert("로그인 만료\n다시 로그인 해주세요");
                    }
                });
            }
        },
    });

    
    
  return (
    <div>

    </div>
        
    
  );
}