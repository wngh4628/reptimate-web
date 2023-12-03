"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Mobile, PC } from "./ResponsiveLayout";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  isLoggedInState,
  userAtom,
  chatVisisibleState,
  fcmState,
  fcmNotificationState,
  notiVisisibleState,
} from "@/recoil/user";
import {
  chatRoomState,
  chatRoomVisisibleState,
  receivedNewChatState,
} from "@/recoil/chatting";
import PersonalChat from "@/components/chat/personalChat";

import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

export default function Header() {
  const login = false;
  const pathName = usePathname() || "";
  const router = useRouter();
  const params = useSearchParams();
  const chatQueryParam = params?.get("chat") || "";
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
        // console.error("Error parsing JSON from cookie:", error);
        return null;
      }
    }
  }

  useEffect(() => {
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
      setIsChatVisisible(true);
    }
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        // 알림을 보낼 수 있는 상태
      } else if (Notification.permission !== "denied") {
        // 알림 권한을 요청할 수 있는 상태
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            // 권한이 허용됨
          } else {
            // 권한이 거부됨
          }
        });
      } else {
        // 알림 권한이 거부됨
      }
    }
  }, []);

  const [fcm, setfcm] = useRecoilState(fcmState);
  const [fcmNotification, setfcmNotification] =
    useRecoilState(fcmNotificationState);

  useEffect(() => {
    handleLogin();
    const user = navigator.userAgent;
    if (user.indexOf("iPhone") > -1 || user.indexOf("Android") > -1) {
    } else {
      onMessageFCM();
    }
  }, [pathName]);

  useEffect(() => {}, []);
  useEffect(() => {}, [receivedNewChat]);

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

    getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY })
      .then((currentToken) => {
        if (currentToken) {
          setfcm(currentToken);
        } else {
        }
      })
      .catch((err) => {
        // console.log("An error occurred while retrieving token. ", err);
      });
    // 메세지가 수신되면 역시 콘솔에 출력합니다.
    onMessage(messaging, (payload) => {
      setreceivedNewChat(true);
      // console.log("messaging================");
      // console.log("*");
      // console.log(payload);
      // console.log("*");
      // console.log("==================");
      const body = payload.notification?.body || "";
      const title = payload.notification?.title || "";
      setfcmNotification({
        body: body,
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
        setIsLoggedIn(true);
      }
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("recoil-persist");
    setIsLoggedIn(false);
    router.refresh();
    window.location.reload();
  };

  function chattingClick() {
    if (isLoggedIn) {
      // console.log("채팅 목록 켜기");
      setIsChatVisisible(true);
    }
  }
  function chattingClose() {
    setIsChatVisisible(false);
    setchatRoomVisisibleState(false);
  }
  function chattingClickM() {
    setIsChatVisisible(!isChatVisisible);
  }

  function notiClick() {
    if (isLoggedIn) {
      // console.log("알림 목록 켜기");
      setIsNotiVisisible(true);
    }
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
      if (pathName === "/my/bookmark") return null;
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
    <header className="w-full fixed top-0 bg-white shadow-md z-[9999]">
      {/* PC 화면(반응형) */}
      <PC>
        <div className="flex justify-end pt-2 gap-2 text-sm max-w-screen-xl mx-auto">
          {isLoggedIn ? (
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
        <div className="flex justify-between items-center py-4 max-w-screen-xl mx-auto">
          <Link href={link}>
            <div className="flex w-[170px]">
              <img src="/img/main_logo2.png" />
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
              <div className="flex w-[23px] h-5 mb-0.5  relative">
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
        <div className="flex justify-start pt-2 pl-3 pr-3 pb-2">
          <Link href={link}>
            <div className="flex w-32 p1-0">
              <img src="/img/main_logo2.png" />
            </div>
          </Link>
          <nav className="flex gap-4 font-bold ml-auto">
            <Link href="">
              <div
                className="flex w-[23px] h-5 my-0.5 relative"
                onClick={chattingClick}
              >
                <img src="/img/chat.png" />
                {receivedNewChat && (
                  <div className="absolute rounded-[50%] bg-red-600 w-[6px] h-[6px] z-[9999] top-0 right-0"></div>
                )}
              </div>
            </Link>
            <a onClick={notiClick}>
              <div className="flex gap-4 w-5 my-0.5">
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
              ? "bg-white w-full h-[460px] z-[9999] fixed top-0 border-[2px] border-gray-300 flex flex-col shadow-md"
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
              ? "bg-white w-full h-full z-[10000] fixed bottom-0 border-[2px] border-gray-300 flex flex-col shadow-md"
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
