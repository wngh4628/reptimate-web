"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Mobile, PC } from "./ResponsiveLayout";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { isLoggedInState, userAtom, chatVisisibleState } from "@/recoil/user";
import ChatModal from "@/components/chatting/ChatModal";
import { chatRoomState, chatRoomVisisibleState} from "@/recoil/chatting";
import PersonalChat from "@/components/chat/personalChat"

export default function Header() {
  const login = false; // Set this to true or false based on your logic
  const pathName = usePathname() || "";
  const router = useRouter();
  const [isLogin, isSetLogin] = useState(false);
  const [accessToken, setAccessToken] = useRecoilState(userAtom);

  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [isChatVisisible, setIsChatVisisible] =
    useRecoilState(chatVisisibleState);
  const [isChatVisisible, setIsChatVisisible] = useRecoilState(chatVisisibleState);
  const [chatRoomVisisible, setchatRoomVisisibleState] = useRecoilState(chatRoomVisisibleState);

  useEffect(() => {
    handleLogin();
  }, [pathName]);

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
    console.log("1234");
    setIsChatVisisible(!isChatVisisible);
  }
  function chattingClose() {
    setIsChatVisisible(false);
  }
    console.log("채팅 목록 켜기");
    setIsChatVisisible(true);
  };
  function chattingClose() {
    setIsChatVisisible(false);
    setchatRoomVisisibleState(false)
  };
  function chattingClickM() {
    setIsChatVisisible(!isChatVisisible);
  }

  const communityPathnames = [
    "/",
    "/community/used-deal",
    "/community/free",
    "/community/ask",
  ];

  return (
    <header>
      {/* PC 화면(반응형) */}
      <PC>
        <div className="flex justify-end pr-10 pt-5 gap-2 font-bold">
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
        <div className="flex justify-between items-center pt-3 pl-10 pb-5 pr-10">
          <Link href="/">
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
              href="/my"
              className={`${
                pathName === "/my" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              MY
            </Link>
            <Link href="">
              <div className="flex w-5 my-0.5" onClick={chattingClick}>
                <img src="/img/chat.png" />
              </div>
            </Link>
            <Link href="">
              <div className="flex w-5 my-0.5">
                <img src="/img/notification.png" />
              </div>
            </Link>
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
              ? "bg-white w-[450px] h-[500px] z-[9999] fixed bottom-0 border-[2px] rounded-t-[10px] border-gray-300 right-[40px] flex flex-col shadow-md"
              : "hidden"
          }`}
        >
          <div className="border-b-[1px] border-gray-300 h-[40px] flex flex-row ">
            <p className="text-[20px] text-black self-center">채팅</p>
            <button type="button" onClick={chattingClose}>
              <img
                className="w-[25px] h-[25px] self-center right-0"
                src="/img/search.png"
              />
            </button>
          </div>
        <div className={`${
          isChatVisisible ? "bg-white w-[450px] h-[500px] z-[9999] fixed bottom-0 border-[2px] rounded-t-[10px] border-gray-300 right-[40px] flex flex-col shadow-md" : "hidden"
          }`}>
            <div className="border-b-[1px] border-gray-300 h-[40px] flex justify-between">
              <p className="text-[20px] text-black self-center ml-[16px] pt-[2px]">채팅</p>
              <button className="right-0" type="button" onClick={chattingClose} >
                <img className="w-[15px] h-[15px] self-center mr-[18px]" src="/img/ic_x.png"/>
              </button>
            </div>
            <PersonalChat></PersonalChat>

        </div>
      </PC>
      {/* 모바일 화면(반응형) */}
      <Mobile>
        <div className="flex justify-end pt-2 pb-5 pr-5">
          <nav className="flex gap-4 font-bold">
            {/* <Link href="">
              <div className="flex w-5 my-0.5" onClick={chattingClick}>
                <img src="/img/chat.png" />
              </div>
            </Link> */}
            <a onClick={chattingClick}>
              <div className="flex w-5 my-0.5">
                <img src="/img/chat.png" />
              </div>
            </a>
            <Link href="">
              <div className="flex w-5 my-0.5">
                <img src="/img/notification.png" />
              </div>
            </Link>
            <Link href="">
              <div className="flex w-5 my-0.5">
                <img src="/img/search.png" />
              </div>
            </Link>
          </nav>
        </div>
        {/* <div className={`${
          isChatVisisible ? "" : "hidden"
          }bg-black w-full h-full z-[9999] fixed bottom-0`}>

        </div> */}
      </Mobile>
    </header>
  );
}
