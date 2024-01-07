"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Mobile, PC } from "../ResponsiveLayout";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoggedInState, userAtom } from "@/recoil/user";
import { Posts, getResponse } from "@/service/my/board";
import BoardCard from "../BoardCard";
import BannerSlider from "../BannerSlider";

interface Option {
  value: string;
  label: string;
}

const sortOption: Option[] = [
  { value: "order=DESC&orderCriteria=created", label: "최신순" },
  { value: "order=ASC&orderCriteria=created", label: "오래된 순" },
  { value: "order=DESC&orderCriteria=view", label: "조회 높은 순" },
  { value: "order=ASC&orderCriteria=view", label: "조회 낮은 순" },
];

export default function FreePosts() {
  const [data, setData] = useState<getResponse | null>(null);
  const [page, setPage] = useState(1);
  const [existNextPage, setENP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("order=DESC&orderCriteria=created");
  const isLogin = useRecoilValue(userAtom);
  const target = useRef(null);

  const setUser = useSetRecoilState(userAtom);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  const options = {
    threshold: 1.0,
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSort = e.target.value;
    setSort(selectedSort);
    setPage(1);
    setData(null);
  };

  let userAccessToken: string | null = null;
  let currentUserIdx: number | null = 0;
  let userProfilePath: string | null = null;
  let userNickname: string | null = null;
  if (typeof window !== "undefined") {
    // Check if running on the client side
    const storedData = localStorage.getItem("recoil-persist");
    if (storedData != null) {
      const userData = JSON.parse(storedData || "");
      currentUserIdx = userData.USER_DATA.idx;
      userAccessToken = userData.USER_DATA.accessToken;
      userProfilePath = userData.USER_DATA.profilePath;
      userNickname = userData.USER_DATA.nickname;
    }
  }

  const getItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/board?page=${page}&size=20&${sort}&category=free&userIdx=${currentUserIdx}`
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    getItems();
  }, [sort]);

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

  const itemlist: Posts[] =
    data !== null && data.result.items
      ? data.result.items.map((item) => ({
          idx: item.idx,
          view: item.view,
          userIdx: item.userIdx,
          title: item.title,
          category: item.category,
          writeDate: new Date(item.writeDate),
          thumbnail: item.thumbnail,
          nickname: item.UserInfo.nickname,
          profilePath: item.UserInfo.profilePath,
          hasBookmarked: item.hasBookmarked,
        }))
      : [];

  return (
    <section>
      <BannerSlider />
      <PC>
        <div className="flex items-center relative ml-10 mr-10">
          <h2 className="text-xl font-bold ml-1">자유 게시판</h2>
          <div className="relative ml-auto">
            <select
              className="text-black bg-white p-1 border-[1px] rounded-md focus:outline-none text-sm my-2 "
              value={sort}
              onChange={handleSortChange}
            >
              {sortOption.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </PC>
      <Mobile>
        <div className="flex items-center relative  ml-4 mr-4">
          <h2 className="text-lg font-bold y-2">자유 게시판</h2>
          <div className="relative ml-auto">
            <select
              className="text-black bg-white p-1 border-[1px] rounded-md focus:outline-none text-sm my-2"
              value={sort}
              onChange={handleSortChange}
            >
              {sortOption.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Mobile>
      {/* 게시글 목록 PC */}
      <PC>
        {data?.result.items.length === 0 ? (
          <div className="flex items-center justify-center h-[233.59px]">
            <p className="font-semibold text-[18px] text-gray-500">
              작성된 게시글이 없습니다.
            </p>
          </div>
        ) : (
          <div>
            {data !== null && data.result.items ? (
              <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 ml-10 mr-10">
                {itemlist.map((post) => (
                  <BoardCard post={post} key={post.idx} />
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-screen">
                <div className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
      </PC>
      {/* 게시글 목록 모바일 */}
      <Mobile>
        {data?.result.items.length === 0 ? (
          <div className="flex items-center justify-center h-[183.5px]">
            <p className="font-semibold text-[18px] text-gray-500">
              작성된 게시글이 없습니다.
            </p>
          </div>
        ) : (
          <div>
            {data !== null && data.result.items ? (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-4 ml-4 mr-4">
                {itemlist.map((post) => (
                  <BoardCard post={post} key={post.idx} />
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-screen">
                <div className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
      </Mobile>
      {existNextPage && (
        <div className="flex justify-center">
          <div
            className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"
            ref={target}
          ></div>
        </div>
      )}

      <PC>
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
      </PC>
      <Mobile>
        {isLogin && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              className="w-14 h-14 rounded-full bg-main-color text-white flex justify-center items-center text-4xl"
              onClick={handleWriteClick}
            >
              +
            </button>
          </div>
        )}
      </Mobile>
    </section>
  );
}
