"use client";

import { getResponse, Adpotion } from "@/service/my/adoption";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import PostCard from "../PostCard";
import { Mobile, PC } from "../ResponsiveLayout";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/recoil/user";
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

export default function AdoptionPosts() {
  const [data, setData] = useState<getResponse | null>(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("order=DESC&orderCriteria=created");
  const [existNextPage, setENP] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLogin = useRecoilValue(userAtom);
  const target = useRef(null);

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
        `${process.env.NEXT_PUBLIC_API_URL}/board?page=${page}&size=20&${sort}&category=adoption`
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
    location.href = `adoption/write`;
  };

  const itemlist: Adpotion[] =
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
          price: item.boardCommercial.price,
          gender: item.boardCommercial.gender,
          size: item.boardCommercial.size,
          variety: item.boardCommercial.variety,
          state: item.boardCommercial.state,
        }))
      : [];

  return (
    <section>
      {/* 광고 배너 */}
      <BannerSlider />
      {/* 솔트링 콤보 박스 PC */}
      <PC>
        <div className="flex items-center relative ml-10 mr-10">
          <p className="font-bold text-[20px]">분양글</p>
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
      {/* 솔트링 콤보 박스 모바일 */}
      <Mobile>
        <div className="flex items-center relative ml-4 mr-4">
          <h2 className="text-lg font-bold my-2">분양글</h2>
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
                  <li key={post.idx}>
                    <PostCard post={post} />
                  </li>
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
              <ul className="grid grid-cols-2 gap-x-4 gap-y-4 pl-4 pr-4">
                {itemlist.map((post) => (
                  <PostCard key={post.idx} post={post} />
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
              className="w-12 h-12 rounded-full bg-main-color text-white flex justify-center items-center text-5xl"
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
