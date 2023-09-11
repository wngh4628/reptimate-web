"use client"
import { ChangeEvent, FormEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { userAtom, isLoggedInState } from "@/recoil/user";

import  { useReGenerateTokenMutation } from "@/api/accesstoken/regenerate"
import axios from "axios";

import { getResponse, Post } from "@/service/posts";
import { getResponseAuction, Auction } from "@/service/auction";
import { getResponseReply, Reply } from "@/service/reply";
import BoardItem from "./BookmarkItem";
import AuctionItem from "../auction/AuctionItem";

export default function BookmarkList() {
    const setIsLoggedIn = useSetRecoilState(isLoggedInState);
    const reGenerateTokenMutation = useReGenerateTokenMutation();

    const router = useRouter();

    const [data, setData] = useState<getResponse | null>(null);
    const [replyData, setReplyData] = useState<getResponseAuction | null>(null);

    const [boardPage, setBoardPage] = useState(1);
    const [replyPage, setReplyPage] = useState(1);

    const [existNextPage, setENP] = useState(false);
    //const isLogin = useRecoilValue(isLoggedInState);s
    const target = useRef(null);
    const [loading, setLoading] = useState(false);

    const [accessToken, setAccessToken] = useState("");

    const [myBoardType, setMyBoardType] = useState(true);
    const pathName = usePathname() || "";

    const options = {
        threshold: 1.0,
    };

    function onMyBoardTypeChange() {
        if (myBoardType){
            setMyBoardType(false);
            setReplyPage(1)
            setReplyData(null)
        } else {
            setMyBoardType(true);
            setBoardPage(1)
            setData(null)
        }
        console.log("myBoardType  :  "+ myBoardType);
    }

    const getItems = useCallback(async (accessToken: any) => {
        setLoading(true);
        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
            };
            if(myBoardType) {
                console.log("리스트 요청  :  게시글 목록");
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/mypage/bookmark?page=${boardPage}&size=20&order=DESC`
                  , config);
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
                  setBoardPage((prevPage) => prevPage + 1);
            } else {
                console.log("리스트 요청  :  댓글 목록");
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/mypage/auction?page=${replyPage}&size=20&order=DESC`
                  , config);
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
                      } as getResponseAuction)
                  );
                  setENP(response.data?.result.existsNextPage);
                  setReplyPage((prevPage) => prevPage + 1);
            }
        } catch (error: any) {
            // 에러가 발생하면 여기에서 처리할 수 있습니다.
            console.error('Error fetching user data:', error.response.data);
            if(error.response.data.status == 401) {
                const storedData = localStorage.getItem('recoil-persist');
                if (storedData) {
                    const userData = JSON.parse(storedData);
                    if (userData.USER_DATA.accessToken) {
                        const extractedARefreshToken = userData.USER_DATA.refreshToken;
                        reGenerateTokenMutation.mutate({
                            refreshToken: extractedARefreshToken
                        }, {
                            onSuccess: (data) => {
                                // api call 재선언
                                getItems(data);
                            },
                            onError: () => {
                                router.replace("/");
                                // 
                                alert("로그인 만료\n다시 로그인 해주세요\n 에메메");
                            }
                        });
                    } else {
                        router.replace("/");
                        alert("로그인이 필요한 기능입니다.");
                    }
                }
            }
        }
        setLoading(false);
    }, [replyPage,boardPage]);


    useEffect(() => {
        const storedData = localStorage.getItem('recoil-persist');
        if (storedData) {
            const userData = JSON.parse(storedData);
            if (userData.USER_DATA.accessToken) {
                const extractedAccessToken = userData.USER_DATA.accessToken;
                setAccessToken(extractedAccessToken);

                getItems(extractedAccessToken);
            } else {
                router.replace("/");
                alert("로그인이 필요한 기능입니다.");
            }
        }
    }, [myBoardType])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !loading && existNextPage) {
                    getItems(accessToken);
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


    

    const boardItemlist: Post[] = (data?.result.items ?? []).map((item) => ({
        idx: item.idx,
        view: item.view,
        userIdx: item.userIdx,
        title: item.title,
        description: item.description,
        category: item.category,
        writeDate: new Date(item.writeDate),
        coverImage: item.images[0]?.coverImgPath || "",
        nickname: item.UserInfo.nickname,
        profilePath: item.UserInfo.profilePath,
    }));

    const auctionItemlist: Auction[] = (replyData?.result.items ?? []).map((item) => ({
        idx: item.idx,
        view: item.view,
        userIdx: item.userIdx,
        title: item.title,
        category: item.category,
        createdAt: new Date(item.writeDate),
        coverImage: item.images[0]?.coverImgPath || "",
        nickname: item.UserInfo.nickname,
        currentPrice: item.boardAuction.currentPrice,
        endTime: item.boardAuction.endTime,
        gender: item.boardAuction.gender,
        size: item.boardAuction.size,
        variety: item.boardAuction.variety,
        state: item.boardAuction.state,
        unit: item.boardAuction.unit,
        boardIdx: item.boardAuction.boardIdx,
    }));

    return (
        <section className="w-full">
                <div className='w-full flex justify-center'>
                    <div className="w-[96%]">
                        <div className=" h-[120px]">
                            <div className="flex border-[1px] border-gray-300 h-[50%] items-center">
                                <p className="flex font-bold text-[20px] pl-[2%]"
                                >북마크</p>
                            </div>
                            <div className="border-x-[1px] border-b-[1px] border-gray-300 h-[50%] flex-row flex">
                                <div className="border-r-[1px] border-gray-300 w-[50%]">
                                    <button onClick={onMyBoardTypeChange}
                                    className={`${
                                        myBoardType ? "font-bold" : ""
                                        } w-full h-[95%] justify-center text-[18px] pt-[25px]`}>
                                    게시글</button>
                                    <p className={`${
                                        myBoardType ? "" : "hidden"
                                        } bg-[#6D71E6] h-[5%] self-end`}></p>
                                </div>
                                <div className="w-[50%]">
                                    <button onClick={onMyBoardTypeChange}
                                    className={`${
                                        myBoardType ? "" : "font-bold"
                                        } w-full h-[95%] justify-center text-[18px] pt-[25px]`}>
                                    경매</button>
                                    <p className={`${
                                        myBoardType ? "hidden" : ""
                                        } bg-[#6D71E6] h-[5%] self-end`}></p>
                                </div>
                            </div>
                        </div>

                        {myBoardType ? (
                            <ul className="w-full mt-5">
                            {boardItemlist.map((post) => (
                              <li key={post.idx}>
                                <BoardItem post={post} />
                              </li>
                            ))}
                          </ul>
                        ) : (
                            <div></div>
                        )}
                        {!myBoardType ? (
                            <ul className="w-full mt-5">
                            {auctionItemlist.map((post) => (
                              <li key={post.idx}>
                                <AuctionItem post={post} />
                              </li>
                            ))}
                            </ul>
                        ) : (
                            <div></div>
                        )}

                        {existNextPage && (
                            <div className="flex justify-center">
                                <div
                                className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin" ref={target}>
                                </div>
                            </div>
                        )}
            
                    </div>
                </div>
          </section>
      );


      
}