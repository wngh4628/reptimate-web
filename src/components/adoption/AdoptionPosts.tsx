"use client";

import { getResponse, Adpotion } from "@/service/my/adoption";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import PostCard from "../PostCard";
import { Mobile, PC } from "../ResponsiveLayout";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoggedInState, userAtom } from "@/recoil/user";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    Android: {
      getIdx: () => string;
      getAccessToken: () => string;
      getRefreshToken: () => string;
      getNickname: () => string;
      getProfilePath: () => string;
    };
  }
}

export default function AdoptionPosts() {
  const [data, setData] = useState<getResponse | null>(null);
  const [page, setPage] = useState(1);
  const [existNextPage, setENP] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLogin = useRecoilValue(userAtom);
  const target = useRef(null);

  const setUser = useSetRecoilState(userAtom);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.Android !== "undefined"
    ) {
      // 안드로이드 웹뷰를 통해 접속한 경우에만 실행됩니다.
      const idx = parseInt(window.Android.getIdx() || "", 10) || 0;
      const accessToken = window.Android.getAccessToken();
      const refreshToken = window.Android.getRefreshToken();
      const profilePath = window.Android.getProfilePath();
      const nickname = window.Android.getNickname();

      setUser({
        accessToken: accessToken,
        refreshToken: refreshToken,
        idx: idx,
        profilePath: profilePath,
        nickname: nickname,
      });
      setIsLoggedIn(true);

      // 이곳에서 idx와 accessToken을 사용하거나 다른 동작을 수행할 수 있습니다.
      console.log(nickname);
    }
  }, []);

  const options = {
    threshold: 1.0,
  };

  const getItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.reptimate.store/board?page=${page}&size=20&order=DESC&category=adoption`
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
          } as getResponse)
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
    location.href = `community/adoption/write`;
  };

  if (data !== null && data.result.items) {
    const itemlist: Adpotion[] = data.result.items.map((item) => ({
      idx: item.idx,
      view: item.view,
      userIdx: item.userIdx,
      title: item.title,
      category: item.category,
      writeDate: new Date(item.writeDate),
      coverImage:
        item.images[0]?.category === "img"
          ? item.images[0]?.path || ""
          : item.images[0]?.category === "video"
          ? item.images[0]?.coverImgPath || ""
          : "",
      nickname: item.UserInfo.nickname,
      profilePath: item.UserInfo.profilePath,
      price: item.boardCommercial.price,
      gender: item.boardCommercial.gender,
      size: item.boardCommercial.size,
      variety: item.boardCommercial.variety,
      state: item.boardCommercial.state,
    }));

    return (
      <section>
        <PC>
          <h2 className="text-2xl font-bold p-10">분양글</h2>
        </PC>
        <Mobile>
          <h2 className="font-bold pl-3 pt-2 pb-2">분양글</h2>
        </Mobile>
        <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {itemlist.map((post) => (
            <li key={post.idx}>
              <PostCard post={post} />
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
