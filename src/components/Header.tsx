"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Mobile, PC } from "./ResponsiveLayout";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  isLoggedInState,
  userAtom,
  chatVisisibleState,
  fcmState,
  fcmNotificationState,
  notiVisisibleState,
} from "@/recoil/user";
import ChatModal from "@/components/chatting/ChatModal";
import {
  chatRoomState,
  chatRoomVisisibleState,
  receivedNewChatState,
} from "@/recoil/chatting";
import PersonalChat from "@/components/chat/personalChat";

import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import Head from "next/head";

// declare global {
//   interface AndroidInterface {
//     requestNotificationPermission(): void;
//   }

//   const Android: AndroidInterface;
// }

export default function Header() {
  const login = false; // Set this to true or false based on your logic
  const pathName = usePathname() || "";
  const router = useRouter();
  const params = useSearchParams();
  const chatQueryParam = params?.get('chat') || "";

  const [isLogin, isSetLogin] = useState(false);
  const [accessToken, setAccessToken] = useRecoilState(userAtom);

  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);

  const [isChatVisisible, setIsChatVisisible] =
    useRecoilState(chatVisisibleState);
  const [chatRoomVisisible, setchatRoomVisisibleState] = useRecoilState(
    chatRoomVisisibleState
  );

  const [isNotiVisisible, setIsNotiVisisible] =
    useRecoilState(notiVisisibleState);

  const [receivedNewChat, setreceivedNewChat] =
    useRecoilState(receivedNewChatState);

  const setUser = useSetRecoilState(userAtom);
  const setCookieLoggedIn = useSetRecoilState(isLoggedInState);

  function getCookie(name: string) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length == 2) {
      const cookieValue = parts.pop()?.split(";").shift();
      try {
        const cookieObject = JSON.parse(cookieValue || "");
        return cookieObject;
      } catch (error) {
        console.error("Error parsing JSON from cookie:", error);
        return null;
      }
    }
  }

  useEffect(() => {
    // 안드로이드 웹뷰를 통해 접속한 경우에만 실행됩니다.
    const myAppCookie = getCookie("myAppCookie");

    if (myAppCookie !== undefined) {
      console.log(myAppCookie);
      const accessToken = myAppCookie.accessToken;
      const idx = parseInt(myAppCookie.idx || "", 10) || 0;
      const refreshToken = myAppCookie.refreshToken;
      const nickname = myAppCookie.nickname;
      const profilePath = myAppCookie.profilePath;
      console.log("accessToken: " + accessToken);
      console.log("idx: " + idx);
      console.log("refreshToken: " + refreshToken);
      console.log("nickname: " + nickname);
      console.log("profilePath: " + profilePath);
      
      setUser({
        accessToken: accessToken || "",
        refreshToken: refreshToken || "",
        idx: idx || 0,
        profilePath: profilePath || "",
        nickname: nickname || "",
      });
      setCookieLoggedIn(true);
    }
    if (chatQueryParam == "1") {
      setIsChatVisisible(true)
    }
  }, []);

  const [fcm, setfcm] = useRecoilState(fcmState);
  const [fcmNotification, setfcmNotification] =
    useRecoilState(fcmNotificationState);

  useEffect(() => {
    handleLogin();
    if (typeof window.Android === "undefined" || window.Android === null) {
      // 웹 브라우저인 경우에만 실행
      onMessageFCM();
    }
  }, [pathName]);

  useEffect(() => {}, []);

  useEffect(() => {}, [receivedNewChat]);

  const onMessageFCM = async () => {
    // 브라우저에 알림 권한을 요청합니다.
    // if (typeof Android !== "undefined" && Android !== null) {
    //   console.log("this is android webview!");
    // } else {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {console.log("web noti permission return!!"); return;} 

    // 이곳에도 아까 위에서 앱 등록할때 받은 'firebaseConfig' 값을 넣어주세요.
    const firebaseApp = initializeApp({
      apiKey: "AIzaSyCqNXSJVrAFHqn-Or8YgBswuoYMOxEBABY",
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
          // 정상적으로 토큰이 발급되면 콘솔에 출력합니다.
          setfcm(currentToken);
          console.log("fcmToken  :  ",currentToken)
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });
    // 메세지가 수신되면 역시 콘솔에 출력합니다.
    onMessage(messaging, (payload) => {
      console.log("=============fcm 메시지 수신===================");
      console.log("*");
      console.log("Message received. : ", payload);
      console.log("*");
      console.log("============================================");
      setreceivedNewChat(true);
      const body = payload.notification?.body;
      const title = payload.notification?.title || "";
      const result = typeof body === "string" ? JSON.parse(body) : body;
      setfcmNotification({
        body: result,
        title: title,
      });
    });
  };

  const handleLogin = () => {
    const storedData = localStorage.getItem("recoil-persist");
    if (storedData) {
      const userData = JSON.parse(storedData);
      if (userData.USER_DATA.accessToken != null) {
        const accessToken = userData.USER_DATA.accessToken;
        isSetLogin(true);
      }
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("recoil-persist");
    isSetLogin(false);
    setIsLoggedIn(false);
    router.refresh();
    window.location.reload();
  };

  function chattingClick() {
    console.log("채팅 목록 켜기");
    setIsChatVisisible(true);
  }
  function chattingClose() {
    setIsChatVisisible(false);
    setchatRoomVisisibleState(false);
  }
  function chattingClickM() {
    setIsChatVisisible(!isChatVisisible);
  }

  function notiClick() {
    console.log("알림 목록 켜기");
    setIsNotiVisisible(true);
  }
  function notiClose() {
    setIsNotiVisisible(false);
  }

  const communityPathnames = [
    "/",
    "/community/market",
    "/community/free",
    "/community/ask",
  ];

  const isAuctionRoute = pathName.startsWith("/auction");

  // Set the link based on whether it's an "auction" route or not
  const link = isAuctionRoute ? "/auction" : "/";

  if (typeof window !== "undefined") {
    if (window.innerWidth <= 768) {
      if (pathName === "/my/board") return null;
      if (pathName === "/my/auction") return null;
      if (pathName === "/my/bookmpoark") return null;
      if (pathName.startsWith("/streamhost")) return null;
      if (pathName.startsWith("/community/adoption/posts")) return null;
      if (pathName.startsWith("/community/market/posts")) return null;
      if (pathName.startsWith("/community/free/posts")) return null;
      if (pathName.startsWith("/community/ask/posts")) return null;
      if (
        pathName.startsWith("/auction/posts") &&
        !pathName.endsWith("/live")
      ) {
        return null;
      }
    }
  }

  return (
    <header>
      {/* PC 화면(반응형) */}
      <PC>
        <div className="flex justify-end pt-5 gap-2 font-bold">
          {isLogin ? (
            <button
              className="group hover:text-main-color"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          ) : (
            <>
              <Link href="/login" className="group hover:text-main-color">
                로그인
              </Link>
              <Link href="/join" className="group hover:text-main-color">
                회원가입
              </Link>
            </>
          )}
        </div>
        <div className="flex justify-between items-center pt-3 pb-5">
          <Link href={link}>
            <div className="flex w-40">
              <img src="/img/main_logo.png" />
            </div>
          </Link>
          <nav className="flex gap-4 font-bold">
            <Link href="/" className={` group hover:text-main-color`}>
              COMMUNITY
            </Link>
            <Link
              href="/auction"
              className={`${
                pathName === "/auction" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              AUCTION
            </Link>
            <Link
              href="/ai"
              className={`${
                pathName === "/ai" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              AI
            </Link>
            <Link
              href="/my"
              className={`${
                pathName === "/my" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              MY
            </Link>
            <Link href="">
              <div
                className="flex w-[23px] h-5 my-0.5  relative"
                onClick={chattingClick}
              >
                <img src="/img/chat.png" />
                {receivedNewChat && (
                  <div className="absolute rounded-[50%] bg-red-600 w-[6px] h-[6px] z-[9999] top-0 right-0"></div>
                )}
              </div>
            </Link>
            <Link href="">
              <div className="flex w-[23px] h-5 my-0.5  relative">
                <div
                  className="flex w-[23px] h-5 my-0.5  relative"
                  onClick={notiClick}
                >
                  <img src="/img/notification.png" />
                </div>
              </div>
            </Link>
            <Link href="">
              <div className="flex w-[23px] h-5 my-0.5  relative">
                <img src="/img/search.png" />
              </div>
            </Link>
          </nav>
        </div>
        <div
          className={`${
            isChatVisisible
              ? "bg-white w-[450px] h-[500px] z-[9999] fixed bottom-0 border-[2px] rounded-t-[10px] border-gray-300 right-[40px] flex flex-col shadow-md"
              : "hidden"
          }`}
        >
          <div className="border-b-[1px] border-gray-300 h-[40px] flex justify-between">
            <p className="text-[20px] text-black self-center ml-[16px] pt-[2px]">
              채팅
            </p>
            <button className="right-0" type="button" onClick={chattingClose}>
              <img
                className="w-[15px] h-[15px] self-center mr-[18px]"
                src="/img/ic_x.png"
              />
            </button>
          </div>
          <PersonalChat></PersonalChat>
        </div>

        <div
          className={`${
            isNotiVisisible
              ? "bg-white w-[450px] h-[500px] z-[10000] fixed bottom-0 border-[2px] rounded-t-[10px] border-gray-300 right-[40px] flex flex-col shadow-md"
              : "hidden"
          }`}
        >
          <div className="border-b-[1px] border-gray-300 h-[40px] flex justify-between">
            <p className="text-[20px] text-black self-center ml-[16px] pt-[2px]">
              알림
            </p>
            <button className="right-0" type="button" onClick={notiClose}>
              <img
                className="w-[15px] h-[15px] self-center mr-[18px]"
                src="/img/ic_x.png"
              />
            </button>
          </div>
        </div>
      </PC>
      {/* 모바일 화면(반응형) */}
      <Mobile>
        <Head>
          <meta name="viewport" content="user-scalable=no" />
        </Head>
        <div className="flex justify-start pt-2 pb-2 pl-5 pr-5">
          <Link href={link}>
            <div className="flex w-32 p1-0">
              <img src="/img/main_logo.png" />
            </div>
          </Link>
          <nav className="flex gap-4 font-bold ml-auto">
            <a onClick={chattingClick}>
              <div className="flex w-5 my-0.5">
                <img src="/img/chat.png" />
              </div>
            </a>
            <a onClick={notiClick}>
              <div className="flex w-5 my-0.5">
                <img src="/img/notification.png" />
              </div>
            </a>
            <Link href="">
              <div className="flex w-5 my-0.5">
                <img src="/img/search.png" />
              </div>
            </Link>
          </nav>
        </div>
        <div
          className={`${
            isChatVisisible
              ? "bg-white w-full h-full z-[9999] fixed bottom-0 border-[2px] border-gray-300 flex flex-col shadow-md"
              : "hidden"
          }`}
        >
          <div className="border-b-[1px] border-gray-300 h-[40px] flex justify-between">
            <p className="text-[20px] text-black self-center ml-[16px] pt-[2px]">
              채팅
            </p>
            <button className="right-0" type="button" onClick={chattingClose}>
              <img
                className="w-[15px] h-[15px] self-center mr-[18px]"
                src="/img/ic_x.png"
              />
            </button>
          </div>
          <PersonalChat></PersonalChat>
        </div>
        <div
          className={`${
            isNotiVisisible
              ? "bg-white w-full h-full z-[10000] fixed bottom-0 border-[2px] rounded-t-[10px] border-gray-300 flex flex-col shadow-md"
              : "hidden"
          }`}
        >
          <div className="border-b-[1px] border-gray-300 h-[40px] flex justify-between">
            <p className="text-[20px] text-black self-center ml-[16px] pt-[2px]">
              알림
            </p>
            <button className="right-0" type="button" onClick={notiClose}>
              <img
                className="w-[15px] h-[15px] self-center mr-[18px]"
                src="/img/ic_x.png"
              />
            </button>
          </div>
        </div>
      </Mobile>
    </header>
  );
}
