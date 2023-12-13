"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";

import { isLoggedInState } from "@/recoil/user";

import { useReGenerateTokenMutation } from "@/api/accesstoken/regenerate";
import axios from "axios";

import { getResponseBookmarkBoard, BookmarkBoard } from "@/service/my/bookmark";
import BoardItem from "./BookmarkItem";

import Swal from "sweetalert2";

export default function BookmarkList() {
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const reGenerateTokenMutation = useReGenerateTokenMutation();

  const router = useRouter();

  const [data, setData] = useState<getResponseBookmarkBoard | null>(null);
  const [replyData, setReplyData] = useState<getResponseBookmarkBoard | null>(
    null
  );

  const [boardPage, setBoardPage] = useState(1);
  const [replyPage, setReplyPage] = useState(1);

  const [existNextPage, setENP] = useState(false);
  //const isLogin = useRecoilValue(isLoggedInState);
  const target = useRef(null);
  const [loading, setLoading] = useState(false);

  const [accessToken, setAccessToken] = useState("");

  const [myBookmarkType, setMyBoardType] = useState(true);
  const pathName = usePathname() || "";

  const options = {
    threshold: 1.0,
  };

  function onMyBoardTypeChange() {
    if (myBookmarkType) {
      setMyBoardType(false);
      setReplyPage(1);
      setReplyData(null);
    }
  }
  function onMyBoardTypeChange2() {
    if (!myBookmarkType) {
      setMyBoardType(true);
      setBoardPage(1);
      setData(null);
    }
  }

  const getItems = useCallback(
    async (accessToken: any, myBookmarkType: boolean) => {
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        if (myBookmarkType) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/mypage/bookmark/board?page=${boardPage}&size=20&order=DESC`,
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
              } as getResponseBookmarkBoard)
          );
          setENP(response.data?.result.existsNextPage);
          setBoardPage((prevPage) => prevPage + 1);
          // console.log(data);
        } else {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/mypage/bookmark/auction?page=${replyPage}&size=20&order=DESC`,
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
              } as getResponseBookmarkBoard)
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
                    getItems(data, myBookmarkType);
                  },
                  onError: () => {
                    router.replace("/");
                    //
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
        getItems(extractedAccessToken, myBookmarkType);
      } else {
        router.replace("/");
        Swal.fire({
          text: "로그인이 필요한 기능입니다.",
          confirmButtonText: "확인", // confirm 버튼 텍스트 지정
          confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
        });
      }
    }
  }, [myBookmarkType]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loading && existNextPage) {
          getItems(accessToken, myBookmarkType);
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

  const boardItemlist: BookmarkBoard[] = (data?.result.items ?? []).map(
    (item) => ({
      idx: item.board.idx,
      createdAt: new Date(item.board.createdAt),
      updatedAt: new Date(item.board.updatedAt),
      deletedAt: new Date(item.board.deletedAt),
      category: item.category,
      userIdx: item.userIdx,
      title: item.board.title,
      thumbnail: item.board.thumbnail || "",
      media: item.board.media,
      description: item.board.description,
      view: item.board.view,
      commentCnt: item.board.commentCnt,
      status: item.board.status,
      boardCategory: item.board.category,
    })
  );

  
  const auctionItemlist: BookmarkBoard[] = (replyData?.result.items ?? []).map(
    (item) => ({
      idx: item.board.idx,
      createdAt: new Date(item.board.createdAt),
      updatedAt: new Date(item.board.updatedAt),
      deletedAt: new Date(item.board.deletedAt),
      category: item.category,
      userIdx: item.userIdx,
      title: item.board.title,
      thumbnail: item.board.thumbnail || "",
      media: item.board.media,
      description: item.board.description,
      view: item.board.view,
      commentCnt: item.board.commentCnt,
      status: item.board.status,
      boardCategory: item.board.category,
    })
  );

  return (
    <section className="w-full">
      <div className="w-full flex justify-center">
        <div className="w-[96%]">
          <div className=" h-[120px]">
            <div className="flex border-[1px] border-gray-300 h-[50%] items-center">
              <p className="flex font-bold text-[20px] pl-[2%] w-full">
                북마크
              </p>
            </div>
            <div className="border-x-[1px] border-b-[1px] border-gray-300 h-[50%] flex-row flex">
              <div className="border-r-[1px] border-gray-300 w-[50%]">
                <button
                  onClick={onMyBoardTypeChange2}
                  className={`${
                    myBookmarkType ? "font-bold" : ""
                  } w-full h-[95%] justify-center text-[18px] py-[15px]`}
                >
                  게시글
                </button>
                <p
                  className={`${
                    myBookmarkType ? "" : "hidden"
                  } bg-[#6D71E6] h-[5%] self-end`}
                ></p>
              </div>
              <div className="w-[50%]">
                <button
                  onClick={onMyBoardTypeChange}
                  className={`${
                    myBookmarkType ? "" : "font-bold"
                  } w-full h-[95%] justify-center text-[18px] py-[15px]`}
                >
                  경매
                </button>
                <p
                  className={`${
                    myBookmarkType ? "hidden" : ""
                  } bg-[#6D71E6] h-[5%] self-end`}
                ></p>
              </div>
            </div>
          </div>

          {myBookmarkType ? (
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
          {!myBookmarkType ? (
            <ul className="w-full mt-5">
              {auctionItemlist.map((post) => (
                <li key={post.idx}>
                  <BoardItem post={post} />
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
