"use client";
import axios from "axios";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import { socialLogin, socialAppleLogin } from "@/api/login/login";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { isLoggedInState, userAtom, fcmState } from "@/recoil/user";

export default function Home() {
  const router = useRouter();
  const setUser = useSetRecoilState(userAtom);
  const searchParams = useSearchParams();
  const query = searchParams?.get("access_token");
  const query2 = searchParams?.get("socialType");
  const query3 = searchParams?.get("email");
  const query4 = searchParams?.get("nickname");

  const [fcm, setfcm] = useRecoilState(fcmState);

  const mutation = useMutation({
    mutationFn: socialLogin,
    onSuccess: (data) => {
      // status 분기 처리
      const a = JSON.stringify(data.data);
      const resulta = JSON.parse(a);
      const b = JSON.stringify(resulta.result);
      const resultb = JSON.parse(b);
      setUser(resultb);
      router.replace("/");
    },
  });
  const mutationApple = useMutation({
    mutationFn: socialAppleLogin,
    onSuccess: (data) => {
      // status 분기 처리
      const a = JSON.stringify(data.data);
      const resulta = JSON.parse(a);
      const b = JSON.stringify(resulta.result);
      const resultb = JSON.parse(b);
      setUser(resultb);
      router.replace("/");
    },
  });

  useEffect(() => {
    if (query3 && query4 && query2 == "APPLE") {
      const qsocialtype: string = query2;
      const qemail: string = query3;
      const qnickname: string = query4;
      mutationApple.mutate({
        email: qemail,
        nickname: qnickname,
        socialType: "APPLE",
        fbToken: fcm,
      });
    } else if (query && query2) {
      const qa: string = query;
      const qb: string = query2;

      console.log("useEffect / socialLogin / fbToken = " + fcm);

      mutation.mutate({
        accessToken: qa,
        socialType: qb,
        fbToken: fcm,
      });
    }
  }, []);
}
