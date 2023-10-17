"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Mobile, PC } from "../ResponsiveLayout";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoggedInState, userAtom } from "@/recoil/user";
import { getResponseAuction, Auction } from "@/service/my/auction";
import AuctionPostCard from "./AcutionPostCard";

export default function AuctionPosts() {
  const [data, setData] = useState<getResponseAuction | null>(null);
  const [page, setPage] = useState(1);
  const [existNextPage, setENP] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLogin = useRecoilValue(userAtom);
  const target = useRef(null);

  const setUser = useSetRecoilState(userAtom);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  function getCookie(name: string) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) {
      var cookieValue = parts.pop()?.split(";").shift();
      try {
        var cookieObject = JSON.parse(cookieValue || "");
        return cookieObject;
      } catch (error) {
        console.error("Error parsing JSON from cookie:", error);
        return null;
      }
    }
  }

  useEffect(() => {
    // 안드로이드 웹뷰를 통해 접속한 경우에만 실행됩니다.
    var myAppCookie = getCookie("myAppCookie");

    if (myAppCookie !== undefined) {
      console.log(myAppCookie);
      var accessToken = myAppCookie.accessToken;
      var idx = parseInt(myAppCookie.idx || "", 10) || 0;
      var refreshToken = myAppCookie.refreshToken;
      var nickname = myAppCookie.nickname;
      var profilePath = myAppCookie.profilePath;

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
      setIsLoggedIn(true);
    }
  }, []);

  const options = {
    threshold: 1.0,
  };

  const getItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.reptimate.store/board?page=${page}&size=20&order=DESC&category=auction`
      );
      setData(
        (prevData) =>
          ({
            result: {
              items: [
                ...(prevData?.result.items || []),
                ...response.data.result.items,
              ],
              existsNextPage: response.data.result.existsNextPage,
            },
          } as getResponseAuction)
      );
      setENP(response.data?.result.existsNextPage);
      setPage((prevPage) => prevPage + 1);
      console.log(existNextPage);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loading && existNextPage) {
          getItems();
        }
      });
    }, options);

    if (target.current) {
      observer.observe(target.current);
    }

    return () => {
      if (target.current) {
        observer.unobserve(target.current);
      }
    };
  }, [getItems, existNextPage, loading, options]);

  const handleWriteClick = () => {
    // Handle the logic for opening the write page
    location.href = `auction/write`;
  };

  if (data !== null && data.result.items) {
    const itemlist: Auction[] = data.result.items
      .filter((item) => item.boardAuction !== null)
      .map((item) => ({
        idx: item.idx,
        view: item.view,
        userIdx: item.userIdx,
        title: item.title,
        category: item.category,
        createdAt: new Date(item.writeDate),
        coverImage: item.images[0]?.coverImgPath || "",
        nickname: item.UserInfo.nickname,
        currentPrice: item.boardAuction?.currentPrice,
        endTime: item.boardAuction?.endTime,
        gender: item.boardAuction?.gender,
        size: item.boardAuction?.size,
        variety: item.boardAuction?.variety,
        state: item.boardAuction?.state,
        unit: item.boardAuction?.unit,
        boardIdx: item.boardAuction?.boardIdx,
        profilePath: item.UserInfo.profilePath,
      }));

    return (
      <section>
        <PC>
          <h2 className="text-2xl font-bold p-10">경매</h2>
        </PC>
        <Mobile>
          <h2 className="text-xl font-bold pl-12 pt-4 pb-4">경매</h2>
        </Mobile>
        <ul className="pl-10 pr-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {itemlist.map((post) => (
            <li key={post.idx}>
              <AuctionPostCard post={post} />
            </li>
          ))}
        </ul>
        {existNextPage && (
          <div className="flex justify-center">
            <div
              className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"
              ref={target}
            ></div>
          </div>
        )}

        {isLogin && (
          <div className="fixed bottom-10 right-10 z-50">
            <button
              className="w-16 h-16 rounded-full bg-main-color text-white flex justify-center items-center text-5xl"
              onClick={handleWriteClick}
            >
              +
            </button>
          </div>
        )}
      </section>
    );
  } else {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
}
