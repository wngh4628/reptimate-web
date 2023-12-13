"use client";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { userAtom, isLoggedInState } from "@/recoil/user";

import { useReGenerateTokenMutation } from "@/api/accesstoken/regenerate";
import axios from "axios";

import {
  getResponseAuction,
  Auction,
  getResponseBid,
  Bid,
} from "@/service/my/auction";

import AuctionItem from "./AuctionItem";
import AuctionBidItem from "./AuctionBidItem";
import Swal from "sweetalert2";

export default function AuctionList() {
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const reGenerateTokenMutation = useReGenerateTokenMutation();

  const router = useRouter();

  const [data, setData] = useState<getResponseAuction | null>(null);
  const [replyData, setReplyData] = useState<getResponseBid | null>(null);

  const [boardPage, setBoardPage] = useState(1);
  const [replyPage, setReplyPage] = useState(1);

  const [existNextPage, setENP] = useState(false);
  //const isLogin = useRecoilValue(isLoggedInState);
  const target = useRef(null);
  const [loading, setLoading] = useState(false);

  const [accessToken, setAccessToken] = useState("");

  const [myAuctionType, setMyAuctionType] = useState(0);

  const pathName = usePathname() || "";
  const options = {
    threshold: 1.0,
  };

  function onMyAuctionTypeChange() {
    if (myAuctionType == 0) {
      setReplyPage(1);

      setReplyData(null);
      setMyAuctionType(1);
      // console.log("myAuctionType  :  "+ myAuctionType);
    }
  }
  function onMyAuctionTypeChange2() {
    if (myAuctionType == 1) {
      setBoardPage(1);

      setData(null);
      setMyAuctionType(0);
      // console.log("myAuctionType  :  "+ myAuctionType);
    }
  }

  const getItems = useCallback(
    async (accessToken: any, myAuctionType: number) => {
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        if (myAuctionType == 0) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/mypage/auction?page=${boardPage}&size=20&order=DESC&category=auction`,
            config
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
          setBoardPage((prevPage) => prevPage + 1);
          // console.log(data);
          

        } else {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/mypage/bid?page=${replyPage}&size=20&order=DESC`,
            config
          );
          setReplyData(
            (prevData) =>
              ({
                result: {
                  items: [
                    ...(prevData?.result.items || []),
                    ...response.data.result.items,
                  ],
                  existsNextPage: response.data.result.existsNextPage,
                },
              } as getResponseBid)
          );
          setENP(response.data?.result.existsNextPage);
          setReplyPage((prevPage) => prevPage + 1);
          // console.log(replyData);
        }
      } catch (error: any) {
        // 에러가 발생하면 여기에서 처리할 수 있습니다.
        // console.error("Error fetching user data:", error.response.data);
        if (error.response.data.status == 401) {
          const storedData = localStorage.getItem("recoil-persist");
          if (storedData) {
            const userData = JSON.parse(storedData);
            if (userData.USER_DATA.accessToken) {
              const extractedARefreshToken = userData.USER_DATA.refreshToken;
              reGenerateTokenMutation.mutate(
                {
                  refreshToken: extractedARefreshToken,
                },
                {
                  onSuccess: (data) => {
                    // api call 재선언
                    getItems(data, myAuctionType);
                  },
                  onError: () => {
                    router.replace("/");
                    setIsLoggedIn(false);
                    Swal.fire({
                      text: "로그인 만료\n다시 로그인 해주세요",
                      confirmButtonText: "확인", // confirm 버튼 텍스트 지정
                      confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
                    });
                  },
                }
              );
            } else {
              router.replace("/");
              Swal.fire({
                text: "로그인이 필요한 기능입니다.",
                confirmButtonText: "확인", // confirm 버튼 텍스트 지정
                confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
              });
            }
          }
        }
      }
      setLoading(false);
    },
    [replyPage, boardPage]
  );

  useEffect(() => {
    const storedData = localStorage.getItem("recoil-persist");
    if (storedData) {
      const userData = JSON.parse(storedData);
      if (userData.USER_DATA.accessToken) {
        const extractedAccessToken = userData.USER_DATA.accessToken;
        setAccessToken(extractedAccessToken);

        getItems(extractedAccessToken, myAuctionType);
      } else {
        router.replace("/");
        setIsLoggedIn(false);
        Swal.fire({
          text: "로그인이 필요한 기능입니다.",
          confirmButtonText: "확인", // confirm 버튼 텍스트 지정
          confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
        });
      }
    }
  }, [myAuctionType]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loading && existNextPage) {
          getItems(accessToken, myAuctionType);
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

  const boardItemlist: Auction[] = (data?.result.items ?? []).map((item) => ({
    idx: item.idx,
    view: item.view,
    userIdx: item.userIdx,
    title: item.title,
    category: item.category,
    createdAt: new Date(item.writeDate),
    thumbnail: item.thumbnail,
    nickname: item.UserInfo.nickname,
    profilePath: item.UserInfo.profilePath,
    currentPrice: item.boardAuction?.currentPrice || 0,
    endTime: item.boardAuction?.endTime || "",
    gender: item.boardAuction?.gender,
    size: item.boardAuction?.size,
    variety: item.boardAuction?.variety,
    state: item.boardAuction?.state,
    unit: item.boardAuction?.unit,
    boardIdx: item.boardAuction?.boardIdx,
  }));
  const replyItemlist: Bid[] = (replyData?.result.items ?? []).map((item) => ({
    idx: item.board.idx,
    userIdx: item.userIdx,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    deletedAt: new Date(item.deletedAt),
    type: item.type,
    score: item.score,
    roomIdx: item.roomIdx,
    message: item.message,
    action: item.action,
    title: item.board.title,
  }));

  return (
    <section className="w-full">
      <div className="w-full flex justify-center">
        <div className="w-[96%]">
          <div className=" h-[120px]">
            <div className="flex border-[1px] border-gray-300 h-[50%] items-center">
              <p className="flex font-bold text-[20px] pl-[2%] w-full">
                내 경매
              </p>
            </div>
            <div className="border-x-[1px] border-b-[1px] border-gray-300 h-[50%] flex-row flex">
              <div className="border-r-[1px] border-gray-300 w-[50%]">
                <button
                  onClick={onMyAuctionTypeChange2}
                  className={`${
                    myAuctionType == 0 ? "font-bold" : ""
                  } w-full h-[95%] justify-center text-[18px] py-[15px]`}
                >
                  경매
                </button>
                <p
                  className={`${
                    myAuctionType == 0 ? "" : "hidden"
                  } bg-[#6D71E6] h-[5%] self-end`}
                ></p>
              </div>
              <div className="w-[50%]">
                <button
                  onClick={onMyAuctionTypeChange}
                  className={`${
                    myAuctionType == 0 ? "" : "font-bold"
                  } w-full h-[95%] justify-center text-[18px] py-[15px]`}
                >
                  내 비딩
                </button>
                <p
                  className={`${
                    myAuctionType == 0 ? "hidden" : ""
                  } bg-[#6D71E6] h-[5%] self-end`}
                ></p>
              </div>
            </div>
          </div>

          {myAuctionType == 0 ? (
            <ul className="w-full mt-5 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
              {boardItemlist.map((post) => (
                <li key={post.idx}>
                  <AuctionItem post={post} />
                </li>
              ))}
            </ul>
          ) : (
            <div></div>
          )}

          {myAuctionType == 1 ? (
            <ul className="w-full mt-5">
              {replyItemlist.map((post) => (
                <li key={post.idx}>
                  <AuctionBidItem post={post} />
                </li>
              ))}
            </ul>
          ) : (
            <div></div>
          )}

          {existNextPage && (
            <div className="flex justify-center">
              <div
                className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"
                ref={target}
              ></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
