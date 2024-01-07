"use client";

import { getResponse, Adpotion } from "@/service/my/adoption";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PostCard from "../PostCard";
import { Mobile, PC } from "../ResponsiveLayout";
import BannerSlider from "../BannerSlider";
import { Auction, getResponseAuction } from "@/service/my/auction";
import { Posts } from "@/service/my/board";
import AuctionPostCard from "../auction/AucutionPostCard";
import BoardCard from "../BoardCard";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { isLoggedInState } from "@/recoil/user";

export default function HomePosts() {
  const [data1, setData1] = useState<getResponseAuction | null>(null); // 옥션 데이터
  const [data2, setData2] = useState<getResponse | null>(null); // 분양글 데이터
  const [data3, setData3] = useState<getResponse | null>(null); // 중고 거래 데이터
  const [data4, setData4] = useState<getResponse | null>(null); // 자유 데이터
  const [data5, setData5] = useState<getResponse | null>(null); // 질문 데이터
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);

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
      //옥션 게시글 목록 api
      const response1 = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/board/auction?page=1&size=5&order=DESC&orderCriteria=created&category=auctionSelling&userIdx=${currentUserIdx}`
      );
      setData1(
        (prevData) =>
          ({
            result: {
              items: [
                ...(prevData?.result.items || []),
                ...response1.data.result.items,
              ],
              existsNextPage: response1.data.result.existsNextPage,
            },
          } as getResponseAuction)
      );

      // 분양글 게시글 목록 api
      const response2 = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/board?page=1&size=5&order=DESC&orderCriteria=created&category=adoption&userIdx=${currentUserIdx}`
      );
      setData2(
        (prevData) =>
          ({
            result: {
              items: [
                ...(prevData?.result.items || []),
                ...response2.data.result.items,
              ],
              existsNextPage: response2.data.result.existsNextPage,
            },
          } as getResponse)
      );

      console.log(response2);

      // 중고거래 게시글 목록 api
      const response3 = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/board?page=1&size=5&order=DESC&orderCriteria=created&category=market&userIdx=${currentUserIdx}`
      );
      setData3(
        (prevData) =>
          ({
            result: {
              items: [
                ...(prevData?.result.items || []),
                ...response3.data.result.items,
              ],
              existsNextPage: response3.data.result.existsNextPage,
            },
          } as getResponse)
      );

      // 자유 게시글 목록 api
      const response4 = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/board?page=1&size=5&order=DESC&orderCriteria=created&category=free&userIdx=${currentUserIdx}`
      );
      setData4(
        (prevData) =>
          ({
            result: {
              items: [
                ...(prevData?.result.items || []),
                ...response4.data.result.items,
              ],
              existsNextPage: response4.data.result.existsNextPage,
            },
          } as getResponse)
      );

      // 질문 게시글 목록 api
      const response5 = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/board?page=1&size=5&order=DESC&orderCriteria=created&category=ask&userIdx=${currentUserIdx}`
      );
      setData5(
        (prevData) =>
          ({
            result: {
              items: [
                ...(prevData?.result.items || []),
                ...response5.data.result.items,
              ],
              existsNextPage: response5.data.result.existsNextPage,
            },
          } as getResponse)
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getItems();
  }, []);

  // 경매 게시판
  const itemlist1: Auction[] =
    data1 !== null && data1.result.items
      ? data1.result.items.map((item) => ({
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
          hasBookmarked: item.hasBookmarked,
        }))
      : [];

  // 분양 게시판
  const itemlist2: Adpotion[] =
    data2 !== null && data2.result.items
      ? data2.result.items.map((item) => ({
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
          hasBookmarked: item.hasBookmarked,
        }))
      : [];

  // 중고 거래 게시판
  const itemlist3: Adpotion[] =
    data3 !== null && data3.result.items
      ? data3.result.items.map((item) => ({
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
          hasBookmarked: item.hasBookmarked,
        }))
      : [];

  //자유 게시판
  const itemlist4: Posts[] =
    data4 !== null && data4.result.items
      ? data4.result.items.map((item) => ({
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

  // 질문 게시판
  const itemlist5: Posts[] =
    data5 !== null && data5.result.items
      ? data5.result.items.map((item) => ({
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
      {/* 광고 배너 */}
      <BannerSlider />
      <PC>
        {/* AI 메뉴 목록 PC */}
        <div className="flex items-center relative ml-10 mr-10 my-2">
          <p className="font-bold text-[20px]">AI 기능</p>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 ml-11 mr-10">
          {/* 모프 가치 판단 */}
          <div className="relative">
            <Link href={`/ai/valueanalysis`}>
              {/* 대표 이미지 부분 */}
              <div className="relative w-[290px] h-[171px] shadow-md shadow-gray-400 overflow-hidden hover:border-2 hover:border-main-color rounded-md">
                {/* 대표 이미지 쉐도우 */}
                <img
                  className="object-cover w-full h-full"
                  src={"/img/ai_value.png"}
                  alt={""}
                  style={{ zIndex: 1 }}
                />
              </div>
            </Link>
            <div className="m-1 my-2">
              <h3 className="text-[16px] font-bold">모프 가치 판단</h3>
            </div>
          </div>
          {/* 브리딩 라인 추천 */}
          <div className="relative">
            <Link href={`/ai/linebreeding`}>
              {/* 대표 이미지 부분 */}
              <div className="relative w-[290px] h-[171px] shadow-md shadow-gray-400 overflow-hidden hover:border-2 hover:border-main-color rounded-md">
                {/* 대표 이미지 쉐도우 */}
                <img
                  className="object-cover w-full h-full"
                  src={"/img/ai_linebreeding.png"}
                  alt={""}
                  style={{ zIndex: 1 }}
                />
              </div>
            </Link>
            <div className="m-1 my-2">
              <h3 className="text-[16px] font-bold">브리딩 라인 추천</h3>
            </div>
          </div>
          {/* 암수 구분 기능 */}
          <div className="relative">
            <Link href={`/ai/gender`}>
              {/* 대표 이미지 부분 */}
              <div className="relative w-[290px] h-[171px] shadow-md shadow-gray-400 overflow-hidden hover:border-2 hover:border-main-color rounded-md">
                {/* 대표 이미지 쉐도우 */}
                <img
                  className="object-cover w-full h-full"
                  src={"/img/ai_gender.png"}
                  alt={""}
                  style={{ zIndex: 1 }}
                />
              </div>
            </Link>
            <div className="m-1 my-2">
              <h3 className="text-[16px] font-bold">암수 구분 기능</h3>
            </div>
          </div>
          {/* 사육 챗봇 */}
          <div className="relative">
            <Link href={`/ai/aibreeder`}>
              {/* 대표 이미지 부분 */}
              <div className="relative w-[290px] h-[171px] shadow-md shadow-gray-400 overflow-hidden hover:border-2 hover:border-main-color rounded-md">
                {/* 대표 이미지 쉐도우 */}
                <img
                  className="object-cover w-full h-full"
                  src={"/img/ai_chatting.png"}
                  alt={""}
                  style={{ zIndex: 1 }}
                />
              </div>
            </Link>
            <div className="m-1 my-2">
              <h3 className="text-[16px] font-bold">사육 챗봇</h3>
            </div>
          </div>
        </ul>
        {/* 경매 게시글 목록 PC */}
        <div className="flex items-center relative ml-10 mr-12 my-2">
          <p className="font-bold text-[20px]">경매</p>
          <div className="relative ml-auto">
            <Link href={`/auction`}>
              <p className="text-gray-500 font-semibold">더보기</p>
            </Link>
          </div>
        </div>
        {data1?.result.items.length === 0 ? (
          <div className="flex items-center justify-center h-[233.59px]">
            <p className="font-semibold text-[18px] text-gray-500">
              현재 진행중인 경매가 없습니다.
            </p>
          </div>
        ) : (
          <div>
            {data1 !== null && data1.result.items ? (
              <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 ml-10 mr-10">
                {itemlist1.map((post) => (
                  <li key={post.idx}>
                    <AuctionPostCard post={post} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-auto">
                <div className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
        {/* 분양 게시글 목록 PC */}
        <div className="flex items-center relative ml-10 mr-12 mb-2">
          <p className="font-bold text-[20px]">분양글</p>
          <div className="relative ml-auto">
            <Link href={`/community/adoption`}>
              <p className="text-gray-500 font-semibold">더보기</p>
            </Link>
          </div>
        </div>
        {data2?.result.items.length === 0 ? (
          <div className="flex items-center justify-center h-[233.59px]">
            <p className="font-semibold text-[18px] text-gray-500">
              작성된 게시글이 없습니다.
            </p>
          </div>
        ) : (
          <div>
            {data2 !== null && data2.result.items ? (
              <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 ml-10 mr-10">
                {itemlist2.map((post) => (
                  <li key={post.idx}>
                    <PostCard post={post} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-auto">
                <div className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
        {/* 중고 거래 게시글 목록 PC */}
        <div className="flex items-center relative ml-10 mr-12 mb-2">
          <p className="font-bold text-[20px]">중고 거래</p>
          <div className="relative ml-auto">
            <Link href={`/community/market`}>
              <p className="text-gray-500 font-semibold">더보기</p>
            </Link>
          </div>
        </div>
        {data3?.result.items.length === 0 ? (
          <div className="flex items-center justify-center h-[233.59px]">
            <p className="font-semibold text-[18px] text-gray-500">
              작성된 게시글이 없습니다.
            </p>
          </div>
        ) : (
          <div>
            {data3 !== null && data3.result.items ? (
              <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 ml-10 mr-10">
                {itemlist3.map((post) => (
                  <li key={post.idx}>
                    <PostCard post={post} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-auto">
                <div className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
        {/* 자유 게시글 목록 PC */}
        <div className="flex items-center relative ml-10 mr-12 mb-2">
          <p className="font-bold text-[20px]">자유 게시판</p>
          <div className="relative ml-auto">
            <Link href={`/community/free`}>
              <p className="text-gray-500 font-semibold">더보기</p>
            </Link>
          </div>
        </div>
        {data4?.result.items.length === 0 ? (
          <div className="flex items-center justify-center h-[233.59px]">
            <p className="font-semibold text-[18px] text-gray-500">
              작성된 게시글이 없습니다.
            </p>
          </div>
        ) : (
          <div>
            {data4 !== null && data4.result.items ? (
              <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 ml-10 mr-10">
                {itemlist4.map((post) => (
                  <li key={post.idx}>
                    <BoardCard post={post} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-auto">
                <div className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
        {/* 질문 게시글 목록 PC */}
        <div className="flex items-center relative ml-10 mr-12 mb-2">
          <p className="font-bold text-[20px]">질문 게시판</p>
          <div className="relative ml-auto">
            <Link href={`/community/ask`}>
              <p className="text-gray-500 font-semibold">더보기</p>
            </Link>
          </div>
        </div>
        {data5?.result.items.length === 0 ? (
          <div className="flex items-center justify-center h-[233.59px]">
            <p className="font-semibold text-[18px] text-gray-500">
              작성된 게시글이 없습니다.
            </p>
          </div>
        ) : (
          <div>
            {data5 !== null && data5.result.items ? (
              <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 ml-10 mr-10">
                {itemlist5.map((post) => (
                  <li key={post.idx}>
                    <BoardCard post={post} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-auto">
                <div className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
      </PC>
      <Mobile>
        {/* 경매 게시글 목록 모바일 */}
        <div className="flex items-center relative ml-4 mr-4 my-2">
          <h2 className="text-lg font-bold my-2">경매</h2>
          <div className="relative ml-auto">
            <Link href={`/auction`}>
              <p className="text-gray-500 font-semibold">더보기</p>
            </Link>
          </div>
        </div>
        {data1?.result.items.length === 0 ? (
          <div className="flex items-center justify-center h-[183.5px]">
            <p className="font-semibold text-[18px] text-gray-500">
              현재 진행중인 경매가 없습니다.
            </p>
          </div>
        ) : (
          <div>
            {data1 !== null && data1.result.items ? (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-4 pl-4 pr-4">
                {itemlist1.map((post) => (
                  <AuctionPostCard key={post.idx} post={post} />
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-screen">
                <div className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
        {/* 분양 게시글 목록 모바일 */}
        <div className="flex items-center relative ml-4 mr-4 my-2">
          <h2 className="text-lg font-bold my-2">분양글</h2>
          <div className="relative ml-auto">
            <Link href={`/community/adoption`}>
              <p className="text-gray-500 font-semibold">더보기</p>
            </Link>
          </div>
        </div>
        {data2?.result.items.length === 0 ? (
          <div className="flex items-center justify-center h-[183.5px]">
            <p className="font-semibold text-[18px] text-gray-500">
              작성된 게시글이 없습니다.
            </p>
          </div>
        ) : (
          <div>
            {data2 !== null && data2.result.items ? (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-4 pl-4 pr-4">
                {itemlist2.map((post) => (
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
        {/* 중고 거래 게시글 목록 모바일 */}
        <div className="flex items-center relative ml-4 mr-4 my-2">
          <h2 className="text-lg font-bold my-2">중고 거래</h2>
          <div className="relative ml-auto">
            <Link href={`/community/market`}>
              <p className="text-gray-500 font-semibold">더보기</p>
            </Link>
          </div>
        </div>
        {data3?.result.items.length === 0 ? (
          <div className="flex items-center justify-center h-[183.5px]">
            <p className="font-semibold text-[18px] text-gray-500">
              작성된 게시글이 없습니다.
            </p>
          </div>
        ) : (
          <div>
            {data3 !== null && data3.result.items ? (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-4 pl-4 pr-4">
                {itemlist3.map((post) => (
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
        {/* 자유 게시글 목록 모바일 */}
        <div className="flex items-center relative ml-4 mr-4 my-2">
          <h2 className="text-lg font-bold my-2">자유 게시판</h2>
          <div className="relative ml-auto">
            <Link href={`/community/free`}>
              <p className="text-gray-500 font-semibold">더보기</p>
            </Link>
          </div>
        </div>
        {data4?.result.items.length === 0 ? (
          <div className="flex items-center justify-center h-[183.5px]">
            <p className="font-semibold text-[18px] text-gray-500">
              작성된 게시글이 없습니다.
            </p>
          </div>
        ) : (
          <div>
            {data4 !== null && data4.result.items ? (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-4 pl-4 pr-4">
                {itemlist4.map((post) => (
                  <BoardCard key={post.idx} post={post} />
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-screen">
                <div className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
        {/* 질문 게시글 목록 모바일 */}
        <div className="flex items-center relative ml-4 mr-4 my-2">
          <h2 className="text-lg font-bold my-2">질문 게시판</h2>
          <div className="relative ml-auto">
            <Link href={`/community/ask`}>
              <p className="text-gray-500 font-semibold">더보기</p>
            </Link>
          </div>
        </div>
        {data5?.result.items.length === 0 ? (
          <div className="flex items-center justify-center h-[183.5px]">
            <p className="font-semibold text-[18px] text-gray-500">
              작성된 게시글이 없습니다.
            </p>
          </div>
        ) : (
          <div>
            {data5 !== null && data5.result.items ? (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-4 pl-4 pr-4">
                {itemlist5.map((post) => (
                  <BoardCard key={post.idx} post={post} />
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
    </section>
  );
}
