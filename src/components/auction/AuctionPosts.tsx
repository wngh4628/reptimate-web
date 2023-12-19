"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Mobile, PC } from "../ResponsiveLayout";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoggedInState, userAtom } from "@/recoil/user";
import { getResponseAuction, Auction } from "@/service/my/auction";
import AuctionPostCard from "./AucutionPostCard";
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
  { value: "order=DESC&orderCriteria=price", label: "가격 높은 순" },
  { value: "order=ASC&orderCriteria=price", label: "가격 낮은 순" },
];

export default function AuctionPosts() {
  const [data, setData] = useState<getResponseAuction | null>(null);
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

  const getItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/board/auction?page=${page}&size=20&${sort}&category=auctionSelling`
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
    location.href = `auction/write`;
  };

  const itemlist: Auction[] =
    data !== null && data.result.items
      ? data.result.items.map((item) => ({
          idx: item.idx,
          view: item.view,
          userIdx: item.userIdx,
          title: item.title,
          category: item.category,
          createdAt: new Date(item.writeDate),
          thumbnail: item.thumbnail,
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
        }))
      : [];

  return (
    <section>
      <PC>
        <div className="mt-24">
          {/* 광고 배너 */}
          <BannerSlider />
          <div className="flex items-center relative ml-10 mr-10">
            <h2 className="font-bold text-[20px]">경매</h2>
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
        </div>
      </PC>

      <Mobile>
        <div className="mt-11">
          <BannerSlider />
          {/* 솔트링 콤보 박스 모바일 */}
          <div className="flex items-center relative  ml-4 mr-4">
            <h2 className="text-lg font-bold my-2">경매</h2>
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
        </div>
      </Mobile>
      <PC>
        {data?.result.items.length === 0 ? (
          <div className="flex items-center justify-center h-[233.59px]">
            <p className="font-semibold text-[18px] text-gray-500">
              현재 진행중인 경매가 없습니다.
            </p>
          </div>
        ) : (
          <div>
            {data !== null && data.result.items ? (
              <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 ml-10 mr-10">
                {itemlist.map((post) => (
                  <AuctionPostCard post={post} key={post.idx} />
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
      <Mobile>
        {data?.result.items.length === 0 ? (
          <div className="flex items-center justify-center h-[183.5px]">
            <p className="font-semibold text-[18px] text-gray-500">
              현재 진행중인 경매가 없습니다.
            </p>
          </div>
        ) : (
          <div>
            {data !== null && data.result.items ? (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-4 ml-4 mr-4">
                {itemlist.map((post) => (
                  <AuctionPostCard post={post} key={post.idx} />
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
          <div className="fixed bottom-6 right-6 z-[1000]">
            <button
              className="w-16 h-16 rounded-full bg-main-color text-white flex justify-center items-center text-5xl"
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
