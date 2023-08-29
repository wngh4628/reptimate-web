"use client"
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { socialLogin } from "@/api/login/login";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { userAtom } from "@/recoil/user";
import { useEffect } from "react";

export default function useAuthKakao() {
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get("code");

  const setUser = useSetRecoilState(userAtom);
  

  const getKakaoToken = useMutation({
    mutationFn: async (code: string) => {
      const data = {
        grant_type: "authorization_code",
        client_id: "007bccc864ba746734949bd87b5bc9dc",
        redirect_uri: "http://localhost:3000/login/kakaologin",
        code,
      };
      const queryString = Object.keys(data)
        .map((key) => `${key}=${data[key as keyof typeof data]}`)
        .join("&");
      return await axios.post(
        "https://kauth.kakao.com/oauth/token",
        queryString,
        {
          headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );
    },
    onSuccess: (res: any) => {
      const { access_token, refresh_token } = res;
      putKakaoTokenToServer.mutate({
        fbToken: "asdfcx",
        accessToken: access_token,
        socialType: "KAKAO",
      });
    },
    retry: false,
  });

  const putKakaoTokenToServer = useMutation({
    mutationFn: socialLogin,
    onSuccess: (data) => {
      // status 분기 처리
      console.log("============================");
      var a = JSON.stringify(data.data);
      var resulta = JSON.parse(a);
      var b = JSON.stringify(resulta.result);
      var resultb = JSON.parse(b);
      console.log("소셜 로그인 성공!  :  " + resultb);
      console.log("============================");
      setUser(resultb);
      router.replace("/");
    },
  });

  useEffect(() => {
    if (query) {
      getKakaoToken.mutate(query);
    }
  }, [query]);
  return ({
    isLoading: getKakaoToken.isLoading || putKakaoTokenToServer.isLoading,
  });
};

