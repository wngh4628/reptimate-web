
"use client"
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { socialLogin, socialAppleLogin } from "@/api/login/login";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { userAtom } from "@/recoil/user";
import { useEffect } from "react";



export default function Home() {
    const router = useRouter();
    const setUser = useSetRecoilState(userAtom);
    const searchParams = useSearchParams();
    const query = searchParams?.get("access_token");
    const query2 = searchParams?.get("socialType"); 
    const query3 = searchParams?.get("email"); 
    const query4 = searchParams?.get("nickname"); 

    const mutation = useMutation({
        mutationFn: socialLogin,
        onSuccess: (data) => {
          // status 분기 처리
          var a = JSON.stringify(data.data);
          var resulta = JSON.parse(a);
          var b = JSON.stringify(resulta.result);
          var resultb = JSON.parse(b);
          setUser(resultb);
          router.replace("/");
        },
    });
    const mutationApple = useMutation({
        mutationFn: socialAppleLogin,
        onSuccess: (data) => {
          // status 분기 처리
          var a = JSON.stringify(data.data);
          var resulta = JSON.parse(a);
          var b = JSON.stringify(resulta.result);
          var resultb = JSON.parse(b);
          setUser(resultb);
          router.replace("/");
        },
    });

    useEffect(() => {
        if (query3 && query4 && query2 == "APPLE") {
            var qsocialtype : string = query2;
            var qemail : string = query3;
            var qnickname : string = query4;
            mutationApple.mutate({
                email: qemail,
                nickname: qnickname,
                socialType: "APPLE",
                fbToken: "f2f23f23f2g34"
            });
        } else if (query && query2) {
            var qa : string = query;
            var qb : string = query2;

            mutation.mutate({
                accessToken: qa,
                socialType: qb,
                fbToken: "vsdvsdvds"
            });
        }
    }, []);
  
    

}