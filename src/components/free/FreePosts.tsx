"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Mobile, PC } from "../ResponsiveLayout";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/recoil/user";
import { Posts, getResponse } from "@/service/my/board";
import PostCard from "../BoardCard";

export default function FreePosts() {
  const [data, setData] = useState<getResponse | null>(null);
  const [page, setPage] = useState(1);
  const [existNextPage, setENP] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLogin = useRecoilValue(userAtom);
  const target = useRef(null);

  const options = {
    threshold: 1.0,
  };

  const getItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://3.35.87.48:3000/board?page=${page}&size=20&order=DESC&category=free`
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
    location.href = `free/write`;
  };

  if (data !== null && data.result.items) {
    const itemlist: Posts[] = data.result.items.map((item) => ({
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
    }));

    return (
      <section>
        <PC>
          <h2 className="text-2xl font-bold p-10">자유 게시판</h2>
        </PC>
        <Mobile>
          <h2 className="text-xl font-bold pl-12 pt-4 pb-4">자유 게시판</h2>
        </Mobile>
        <ul className="pl-10 pr-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
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
