import { Images } from "@/service/my/auction";
import axios, { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Mobile, PC } from "../ResponsiveLayout";
import ImageSlider from "../ImageSlider";
import { useMutation } from "@tanstack/react-query";
import { commentWrtie } from "@/api/comment";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { isLoggedInState, userAtom, chatVisisibleState } from "@/recoil/user";

import { Comment, getCommentResponse } from "@/service/comment";
import CommentCard from "../comment/CommentCard";
import CommentForm from "../comment/CommentForm";
import { adoptionDelete } from "@/api/adoption/adoption";
import { useRouter } from "next/navigation";
import { GetAuctionPostsView } from "@/service/my/auction";
import { auctionDelete } from "@/api/auction/auction";
import { useReGenerateTokenMutation } from "@/api/accesstoken/regenerate";

import {
  chatRoomState,
  chatRoomVisisibleState,
  chatNowInfoState,
  isNewChatState,
  isNewChatIdxState,
} from "@/recoil/chatting";
import {
  chatRoom,
  connectMessage,
  Ban_Message,
  userInfo,
  getResponseChatList,
} from "@/service/chat/chat";

declare global {
  interface Window {
    Android: {
      openNativeActivity: (
        idx: string | string[] | undefined,
        streamKey: string
      ) => void;
      // 다른 메소드나 프로퍼티도 여기에 추가
    };
  }
}

export default function AuctionPostsView() {
  const router = useRouter();
  const params = useParams();
  const idx = params?.idx;

  const [data, setData] = useState<GetAuctionPostsView | null>(null);

  const [commentData, setCommentData] = useState<getCommentResponse | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [existNextPage, setENP] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLogin = useRecoilValue(userAtom);
  const target = useRef(null);

  const [commentFormValue, setCommentFormValue] = useState<string>(""); // 댓글 작성 후, 댓글 폼 불러오기 위한 변수

  const [commentList, setCommentList] = useState<Comment[]>();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [LiveMenuOpen, setLiveMenuOpen] = useState(false);

  const setUser = useSetRecoilState(userAtom);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  function getCookie(name: string) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length == 2) {
      const cookieValue = parts.pop()?.split(";").shift();
      try {
        const cookieObject = JSON.parse(cookieValue || "");
        return cookieObject;
      } catch (error) {
        console.error("Error parsing JSON from cookie:", error);
        return null;
      }
    }
  }

  useEffect(() => {
    // 안드로이드 웹뷰를 통해 접속한 경우에만 실행됩니다.
    const myAppCookie = getCookie("myAppCookie");

    if (myAppCookie !== undefined) {
      console.log(myAppCookie);
      const accessToken = myAppCookie.accessToken;
      const idx = parseInt(myAppCookie.idx || "", 10) || 0;
      const refreshToken = myAppCookie.refreshToken;
      const nickname = myAppCookie.nickname;
      const profilePath = myAppCookie.profilePath;

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
    const storedData = localStorage.getItem("recoil-persist");
    if (storedData) {
      const userData = JSON.parse(storedData);
      if (userData.USER_DATA.accessToken) {
        const extractedAccessToken = userData.USER_DATA.accessToken;
        setAccessToken(extractedAccessToken);
      } else {
      }
    }
  }, []);

  const reGenerateTokenMutation = useReGenerateTokenMutation();
  const [isChatVisisible, setIsChatVisisible] =
    useRecoilState(chatVisisibleState);
  const [chatRoomVisisible, setchatRoomVisisibleState] = useRecoilState(
    chatRoomVisisibleState
  );
  const [isNewChat, setisNewChatState] = useRecoilState(isNewChatState);
  const [isNewChatIdx, setisNewChatIdx] = useRecoilState(isNewChatIdxState);
  const [chatNowInfo, setchatNowInfo] = useRecoilState(chatNowInfoState);
  const [accessToken, setAccessToken] = useState("");
  const [chatRoomData, setchatRoomData] = useState<chatRoom[]>([]);

  function BackButton() {
    const handleGoBack = () => {
      window.history.back(); // Go back to the previous page using window.history
    };

    return (
      <button onClick={handleGoBack} className="cursor-poiter px-2 font-bold">
        &lt; 뒤로가기
      </button>
    );
  }

  const deleteMutation = useMutation({
    mutationFn: auctionDelete,
    onSuccess: (data) => {
      console.log("============================");
      console.log("Successful Deleting of auction post!");
      console.log(data);
      console.log(data.data);
      console.log("============================");
      alert("게시글이 삭제되었습니다.");
      router.replace("/");
    },
  });

  const profileMenu = () => {
    setProfileMenuOpen((prevProfileMenuOpen) => !prevProfileMenuOpen);
  };

  const toggleMenu = () => {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  };

  const handleLiveMenu = () => {
    setLiveMenuOpen(!LiveMenuOpen);
  };

  const handleChat = () => {
    //1:1채팅 코드
    setIsChatVisisible(true);
    checkChatRoom();
  };
  function intoChatting(
    nickname: string,
    roomName: number,
    profilePath: string
  ) {
    setchatRoomVisisibleState(true);
    setchatNowInfo({
      nickname: nickname,
      roomName: roomName,
      profilePath: profilePath,
    });
  }
  const checkChatRoom = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    // 해당 사용자와 개설된 채팅방이 있는지 확인
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CHAT_URL}/chat/room/${post?.UserInfo.idx}`,
        config
      );
      // 개설된 채팅방이 있는 경우
      if (
        post?.UserInfo.nickname &&
        response.data.result &&
        post?.UserInfo.profilePath
      ) {
        intoChatting(
          post.UserInfo.nickname,
          response.data.result,
          post.UserInfo.profilePath
        );
      } else {
        console.error("Error: Some values are undefined");
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
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
                  checkChatRoom();
                },
                onError: () => {
                  router.replace("/");
                  //
                  alert("로그인 만료\n다시 로그인 해주세요");
                },
              }
            );
          } else {
          }
        }
      } else if (error.response.status == 404) {
        // 개설된 채팅방이 없는 경우 첫 채팅 state 지정하여 보냄
        if (error.response.data.errorCode === "CHATROOM_NOT_EXIST") {
          setchatRoomVisisibleState(true);
          setisNewChatState(true);
          if (post?.UserInfo.idx) {
            setisNewChatIdx(post?.UserInfo.idx);
            intoChatting(post.UserInfo.nickname, 0, post.UserInfo.profilePath);
          } else {
            console.error(
              "Error : setisNewChatIdx(post?.UserInfo.idx); : Some values are undefined"
            );
          }
        }
      }
    }
  };

  const handleEdit = () => {
    // Implement th`e edit action here
    window.location.href = `/auction/edit/${idx}`;
  };

  const handleDelete = () => {
    // Implement the delete action here
    const confirmation = window.confirm("해당 게시글을 삭제하시겠습니까?");

    if (confirmation) {
      const requestData = {
        boardIdx: idx,
        userAccessToken: userAccessToken || "",
      };

      deleteMutation.mutate(requestData);
    }
  };

  const handleReport = () => {
    // Implement the report action here
  };

  const handleLogin = () => {
    const confirmation = window.confirm("로그인 후 댓글을 작성할 수 있습니다.");

    if (confirmation) {
      window.location.href = `/login`;
    }
  };

  let userAccessToken: string | null = null;
  let currentUserIdx: number | null = null;
  let userProfilePath: string | null = null;
  let userNickname: string | null = null;
  if (typeof window !== "undefined") {
    // Check if running on the client side
    const storedData = localStorage.getItem("recoil-persist");
    // console.log(storedData);
    if (storedData != null) {
      const userData = JSON.parse(storedData || "");
      currentUserIdx = userData.USER_DATA.idx;
      userAccessToken = userData.USER_DATA.accessToken;
      userProfilePath = userData.USER_DATA.profilePath;
      userNickname = userData.USER_DATA.nickname;
    }
  }

  const options = {
    threshold: 1.0,
  };

  const getData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://reptimate.store/api/board/${idx}?macAdress=`
      );
      // Assuming your response data has a 'result' property
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const post = data?.result;

  const date = new Date(post?.writeDate || "");

  const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero if needed
  const day = date.getDate().toString().padStart(2, "0"); // Add leading zero if needed
  const hours = date.getUTCHours().toString().padStart(2, "0"); // Get hours and add leading zero if needed
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  const postWriteDate = `${year}.${month}.${day}`;
  const postWriteTime = `${hours}:${minutes}`;

  const getCommentData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://reptimate.store/api/board/${idx}/comment?page=${page}&size=20&order=DESC`
      );
      setCommentData(
        (prevData) =>
          ({
            result: {
              items: [
                ...(prevData?.result.items || []),
                ...response.data.result.items,
              ],
              existsNextPage: response.data.result.existsNextPage,
            },
          } as getCommentResponse)
      );
      setENP(response.data?.result.existsNextPage);
      setPage((prevPage) => prevPage + 1);

      // 댓글 데이터를 받은 후에 댓글 리스트를 업데이트
      const newComments = response.data.result.items.map((item: any) => ({
        idx: item.idx,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt,
        userIdx: item.UserInfo.idx,
        boardIdx: item.boardIdx,
        boardState: item.boardState,
        filePath: item.filePath,
        description: item.description,
        replyCnt: item.replyCnt,
        nickname: item.UserInfo.nickname,
        profilePath: item.UserInfo.profilePath,
      }));
      setCommentList((prevCommentList) => [
        ...(prevCommentList || []),
        ...newComments,
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    getCommentData();
    console.log(data);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loading && existNextPage) {
          getCommentData();
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
  }, [getCommentData, existNextPage, loading, options]);

  //댓글 작성 성공 시,
  const mutation = useMutation({
    mutationFn: commentWrtie,
    onSuccess: (data) => {
      console.log("============================");
      console.log("Successful writing of comment!");
      console.log(data);
      console.log(data.data);
      console.log("============================");
      const newComment: Comment = {
        idx: data.data.result.idx,
        createdAt: data.data.result.createdAt,
        updatedAt: data.data.result.updatedAt,
        deletedAt: data.data.result.deletedAt,
        userIdx: data.data.result.userIdx,
        boardIdx: data.data.result.boardIdx,
        boardState: data.data.result.boardState,
        filePath: null,
        description: data.data.result.description,
        replyCnt: data.data.result.replyCnt,
        nickname: userNickname || "",
        profilePath: userProfilePath || "",
      };
      setCommentList((prevCommentList) => [
        newComment,
        ...(prevCommentList || []),
      ]);
    },
    onError: async (error: unknown) => {
      if (isAxiosError(error) && error.response?.data.status === 401) {
        console.log(error.response?.data.status);
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
                onSuccess: async (data1) => {
                  console.log(data1);
                  userAccessToken = data1;
                  console.log(userAccessToken);

                  // Here, we resend the comment write request after getting the new access token
                  const newAccessToken = data1.result.accessToken;
                  const requestData = {
                    boardIdx: data?.result.idx || 0,
                    category: "comment",
                    description: commentFormValue,
                    userAccessToken: newAccessToken,
                  };

                  if (commentFormValue !== "") {
                    mutation.mutate(requestData);

                    setCommentFormValue(""); // 댓글 폼 초기화
                    // 댓글 리스트 다시 로딩을 위해 페이지 및 관련 상태 변수를 초기화합니다.
                    setPage(1);
                    setENP(false);
                    setCommentData(null);
                  } else {
                    // Create the alert message based on missing fields
                    let alertMessage = "오류입니다. :\n 다시 시도해주세요.";

                    alert(alertMessage);
                  }
                },
                onError: () => {
                  router.replace("/login");
                  alert("로그인 만료\n다시 로그인 해주세요");
                },
              }
            );
          } else {
            router.replace("/login");
            alert("로그인이 필요한 기능입니다.");
          }
        }
      }
    },
  });

  if (post !== null && post?.images) {
    const itemlist: Images[] = post.images.map((item) => ({
      idx: item.idx,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      boardIdx: item.boardIdx,
      category: item.category,
      path: item.path,
      mediaSequence: item.mediaSequence,
    }));

    //댓글 작성 버튼 클릭 시
    const handleCommentSubmit = (comment: string) => {
      const requestData = {
        boardIdx: post.idx,
        category: "comment",
        description: comment,
        userAccessToken: userAccessToken || "",
      };

      if (comment !== "") {
        mutation.mutate(requestData);

        setCommentFormValue(""); // 댓글 폼 초기화
        // 댓글 리스트 다시 로딩을 위해 페이지 및 관련 상태 변수를 초기화합니다.
        setPage(1);
        setENP(false);
        setCommentData(null);
      } else {
        // Create the alert message based on missing fields
        let alertMessage = "오류입니다. :\n 다시 시도해주세요.";

        alert(alertMessage);
      }
    };

    const isCurrentUserComment = currentUserIdx === post.UserInfo.idx;

    const handleChatClick = () => {
      //현재 경매의 실시간 채팅을 볼 수 있는 버튼
    };

    const handleViewClick = () => {
      //라이브 방송에 시청자로 참가
      location.href = `/auction/posts/${idx}/live`;
    };

    const handleLiveClick = () => {
      //웹뷰에서 버튼 클릭시 안드로이드 rtmp 송신 액티비티로 이동
      if (window.Android) {
        window.Android.openNativeActivity(idx, post.boardAuction.streamKey);
      }
    };

    return (
      <div>
        {post && (
          <div className="max-w-screen-sm mx-auto">
            <PC>
              <h2 className="text-4xl font-bold pt-10">{post.title}</h2>
              <div className="flex items-center my-2 relative">
                <img
                  className="w-10 h-10 rounded-full border-2 cursor-pointer"
                  src={post.UserInfo.profilePath || "/img/reptimate_logo.png"}
                  alt=""
                  onClick={profileMenu}
                />
                {!isCurrentUserComment && (
                  <div className="flex items-center justify-center absolute top-full mt-1 bg-white border border-gray-200 shadow-lg rounded z-50">
                    {profileMenuOpen && (
                      <ul>
                        <li
                          onClick={() => {
                            handleChat();
                            profileMenu();
                          }}
                          className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                        >
                          1:1채팅하기
                        </li>
                      </ul>
                    )}
                  </div>
                )}
                <p className="text-xl font-bold ml-1">
                  {post.UserInfo.nickname}
                </p>
                <p className="ml-2 text-gray-500">{postWriteDate}</p>
                <p className="ml-1 text-gray-500">{postWriteTime}</p>
                <p className="ml-2 text-gray-500">조회 {post.view}</p>
                <div className="relative ml-auto">
                  <button
                    onClick={toggleMenu}
                    className="text-gray-500 cursor-pointer text-xl"
                  >
                    ⁝
                  </button>
                  {menuOpen && (
                    <div className="flex items-center justify-center absolute right-0 mt-1 w-20 bg-white border border-gray-200 shadow-lg rounded z-50">
                      {isCurrentUserComment ? (
                        <ul>
                          <li
                            onClick={() => {
                              handleEdit();
                              toggleMenu();
                            }}
                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                          >
                            수정
                          </li>
                          <li
                            onClick={() => {
                              handleDelete();
                              toggleMenu();
                            }}
                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                          >
                            삭제
                          </li>
                        </ul>
                      ) : (
                        <ul>
                          <li
                            onClick={() => {
                              handleReport();
                              toggleMenu();
                            }}
                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                          >
                            신고
                          </li>
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <ImageSlider imageUrls={itemlist} />
              <div className="flex flex-row items-center py-3">
                <p className="text-lg font-semibold ml-5">현재 경매가</p>
                <p className="text-xl font-bold ml-auto mr-5">
                  {post.boardAuction.currentPrice
                    ? post.boardAuction.currentPrice.toLocaleString() + "원"
                    : ""}
                  원
                </p>
              </div>
              <div className="flex flex-row items-center py-3">
                <p className="text-lg font-semibold ml-5">즉시 구입가</p>
                <p className="text-xl font-bold ml-auto mr-5">
                  {post.boardAuction.startPrice.toLocaleString()}원
                </p>
              </div>
              <div className="flex flex-row items-center py-3">
                <p className="text-lg font-semibold ml-5">마감 시간</p>
                <p className="text-xl font-bold ml-auto mr-5">
                  {post.boardAuction.endTime}까지
                </p>
              </div>
              <div className="flex flex-row items-center justify-center">
                <div className="w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 text-lg font-bold">시작 가격</p>
                  <p className="pb-1 text-lg">
                    {post.boardAuction.startPrice}원
                  </p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 text-lg font-bold">경매 단위</p>
                  <p className="pb-1 text-lg">{post.boardAuction.unit}원</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 text-lg font-bold">마감 룰</p>
                  <p className="pb-1 text-lg">
                    {post.boardAuction.extensionRule === 1 ? "적용" : "미적용"}
                  </p>
                </div>
              </div>
              <div className="flex flex-row items-center justify-center">
                <div className="w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 text-lg font-bold">품종</p>
                  <p className="pb-1 text-lg">{post.boardAuction.variety}</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 text-lg font-bold">성별</p>
                  <p className="pb-1 text-lg">{post.boardAuction.gender}</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 text-lg font-bold">크기</p>
                  <p className="pb-1 text-lg">{post.boardAuction.size}</p>
                </div>
              </div>
              <div className="flex flex-row items-center justify-center mt-1">
                <div className="w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 text-lg font-bold">모프</p>
                  <p className="pb-1 text-lg">{post.boardAuction.pattern}</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 text-lg font-bold">출생</p>
                  <p className="pb-1 text-lg">{post.boardAuction.birthDate}</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 text-lg font-bold">상태</p>
                  {post.boardAuction.state === "reservation" ? (
                    <p className="pb-1 text-lg text-red-600">예약중</p>
                  ) : post.boardAuction.state === "end" ? (
                    <p className="pb-1 text-lg text-gray-500">판매완료</p>
                  ) : (
                    <p className="pb-1 text-lg text-blue-600">판매중</p>
                  )}
                </div>
              </div>
              <p className="text-lg my-7">{post.description}</p>
              <hr className="border-t border-gray-300 my-1" />
              <div className="flex flex-row items-center py-3">
                <p className="text-lg font-semibold ml-3 mr-2">댓글</p>
                <p className="text-lg font-semibold mr-2">
                  {post.commentCnt}개
                </p>
              </div>
              {userAccessToken ? (
                <div>
                  <CommentForm
                    value={commentFormValue} // 전달할 댓글 폼의 값을 설정합니다.
                    onSubmit={handleCommentSubmit}
                    onChange={(value: string) => setCommentFormValue(value)} // 댓글 폼 값이 변경될 때마다 업데이트합니다.
                  />
                </div>
              ) : (
                <p
                  className="cursor-pointer"
                  onClick={() => {
                    handleLogin();
                  }}
                >
                  로그인 후 댓글을 작성할 수 있습니다.
                </p>
              )}
            </PC>
            <Mobile>
              <BackButton />
              <h2 className="mx-2 text-2xl font-bold pt-5">{post.title}</h2>
              <div className="mx-2 flex items-center my-2 relative">
                <img
                  className="w-10 h-10 rounded-full border-2 cursor-pointer"
                  src={post.UserInfo.profilePath || "/img/reptimate_logo.png"}
                  alt=""
                  onClick={profileMenu}
                />
                {!isCurrentUserComment && (
                  <div className="flex items-center justify-center absolute top-full mt-1 bg-white border border-gray-200 shadow-lg rounded z-50">
                    {profileMenuOpen && (
                      <ul>
                        <li
                          onClick={() => {
                            handleChat();
                            profileMenu();
                          }}
                          className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                        >
                          1:1채팅하기
                        </li>
                      </ul>
                    )}
                  </div>
                )}
                <p className="text-lg font-bold">{post.UserInfo.nickname}</p>
                <p className="ml-2 text-gray-500 text-sm">{postWriteDate}</p>
                <p className="ml-1 text-gray-500 text-sm">{postWriteTime}</p>
                <p className="ml-2 text-gray-500 text-sm">조회 {post.view}</p>
                <div className="relative ml-auto">
                  <button
                    onClick={toggleMenu}
                    className="text-gray-500 cursor-pointer text-xl"
                  >
                    ⁝
                  </button>
                  {menuOpen && (
                    <div className="flex items-center justify-center absolute right-0 mt-1 w-20 bg-white border border-gray-200 shadow-lg rounded z-50">
                      <ul>
                        <li
                          onClick={() => {
                            handleEdit();
                            toggleMenu();
                          }}
                          className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                        >
                          수정
                        </li>
                        <li
                          onClick={() => {
                            handleDelete();
                            toggleMenu();
                          }}
                          className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                        >
                          삭제
                        </li>
                        <li
                          onClick={() => {
                            handleReport();
                            toggleMenu();
                          }}
                          className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                        >
                          신고
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <ImageSlider imageUrls={itemlist} />
              <div className="flex flex-row items-center py-1">
                <p className="font-semibold ml-2">시작가격</p>
                <p className="font-bold ml-auto mr-2">
                  {post.boardAuction.startPrice.toLocaleString()}원
                </p>
              </div>
              <div className="mx-2 flex flex-row items-center justify-center">
                <div className="w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 font-bold">품종</p>
                  <p className="pb-1 text-sm">{post.boardAuction.variety}</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 font-bold">성별</p>
                  <p className="pb-1 text-sm">{post.boardAuction.gender}</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 font-bold">크기</p>
                  <p className="pb-1 text-sm">{post.boardAuction.size}</p>
                </div>
              </div>
              <p className="mx-2 my-4">{post.description}</p>
              <hr className="border-t border-gray-300" />
              <div className="flex flex-row items-center py-2">
                <p className="font-semibold ml-1 mr-1">댓글</p>
                <p className="text-lg font-semibold mr-2">
                  {post.commentCnt}개
                </p>
              </div>
              {userAccessToken ? (
                <div>
                  <CommentForm
                    value={commentFormValue} // 전달할 댓글 폼의 값을 설정합니다.
                    onSubmit={handleCommentSubmit}
                    onChange={(value: string) => setCommentFormValue(value)} // 댓글 폼 값이 변경될 때마다 업데이트합니다.
                  />
                </div>
              ) : (
                <p
                  className="cursor-pointer"
                  onClick={() => {
                    handleLogin();
                  }}
                >
                  로그인 후 댓글을 작성할 수 있습니다.
                </p>
              )}
            </Mobile>
            <PC>
              <div className="fixed bottom-10 right-10 z-50">
                <button
                  className="w-16 h-16 rounded-full bg-main-color text-white flex justify-center items-center text-xl font-bold mb-2"
                  onClick={handleViewClick}
                >
                  Live
                </button>
                <button
                  className="w-16 h-16 rounded-full bg-main-color text-white flex justify-center items-center text-xl font-bold"
                  onClick={handleChatClick}
                >
                  <img
                    src="/img/chat_view.png"
                    className="w-10 h-10 filter invert"
                  />
                </button>
              </div>
            </PC>
            <Mobile>
              <div className="fixed bottom-2 right-2 z-50">
                {!LiveMenuOpen ? (
                  <button
                    className="w-14 h-14 rounded-full bg-main-color text-white flex justify-center items-center text-3xl"
                    onClick={handleLiveMenu}
                  >
                    ⋮
                  </button>
                ) : (
                  <div>
                    {isCurrentUserComment && (
                      <button
                        className="w-14 h-14 rounded-full bg-main-color text-white flex justify-center items-center text-[12px] font-bold mb-1"
                        onClick={handleLiveClick}
                      >
                        방송하기
                      </button>
                    )}
                    <button
                      className="w-14 h-14 rounded-full bg-main-color text-white flex justify-center items-center text-xl font-bold mb-1"
                      onClick={handleChatClick}
                    >
                      <img
                        src="/img/chat_view.png"
                        className="w-9 h-9 filter invert"
                      />
                    </button>
                  </div>
                )}
                {LiveMenuOpen && (
                  <button
                    className="w-14 h-14 rounded-full bg-main-color text-white flex justify-center items-center text-2xl"
                    onClick={handleLiveMenu}
                  >
                    X
                  </button>
                )}
              </div>
            </Mobile>

            <ul className="mt-6">
              {commentList !== null && commentList ? (
                commentList.map((comment) => (
                  <li key={comment.idx}>
                    <CommentCard comment={comment} />
                  </li>
                ))
              ) : (
                <li></li>
              )}
            </ul>
            {existNextPage && (
              <div className="flex justify-center">
                <div
                  className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"
                  ref={target}
                ></div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
