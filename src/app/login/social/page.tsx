"use client";
import { useSetRecoilState } from "recoil";
import { socialLogin, socialAppleLogin } from "@/api/login/login";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { userAtom } from "@/recoil/user";

import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

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
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        // 알림을 보낼 수 있는 상태
      } else if (Notification.permission !== 'denied') {
        // 알림 권한을 요청할 수 있는 상태
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            // 권한이 허용됨
          } else {
            // 권한이 거부됨
          }
        });
      } else {
        // 알림 권한이 거부됨
      }
    }
    const user = navigator.userAgent;
    if ( user.indexOf("iPhone") > -1 || user.indexOf("Android") > -1 ) {
    } else {
      onMessageFCM();
    }
  }, []);

  const onMessageFCM = async () => {
    // 브라우저에 알림 권한을 요청합니다.

    const firebaseApp = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
      authDomain: "iot-teamnova.firebaseapp.com",
      projectId: "iot-teamnova",
      storageBucket: "iot-teamnova.appspot.com",
      messagingSenderId: "290736847856",
      appId: "1:290736847856:web:957b2c6d52cbbae62f3b35",
    });
    const messaging = getMessaging(firebaseApp);

    // 이곳 vapidKey 값으로 아까 토큰에서 사용한다고 했던 인증서 키 값을 넣어주세요.
    getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY })
      .then((currentToken) => {
        if (currentToken) {
          if (query3 && query4 && query2 == "APPLE") {
            const qsocialtype: string = query2;
            const qemail: string = query3;
            const qnickname: string = query4;
            mutationApple.mutate({
              email: qemail,
              nickname: qnickname,
              socialType: "APPLE",
              fbToken: currentToken,
            });
          } else if (query && query2) {
            const qa: string = query;
            const qb: string = query2;
            mutation.mutate({
              accessToken: qa,
              socialType: qb,
              fbToken: currentToken,
            });
          }
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });
  };
}
