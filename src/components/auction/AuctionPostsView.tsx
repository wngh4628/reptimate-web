import { Images } from "@/service/my/auction";
import axios, { isAxiosError } from "axios";
import { useParams, usePathname } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Mobile, PC } from "../ResponsiveLayout";
import ImageSlider from "../ImageSlider";
import { useMutation } from "@tanstack/react-query";
import { commentWrite } from "@/api/comment";
import Image from "next/image";

import unlike_black from "../../../public/img/unlike_black.png";
import like_maincolor from "../../../public/img/like_maincolor.png";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { isLoggedInState, userAtom, chatVisisibleState } from "@/recoil/user";

import { Comment, getCommentResponse } from "@/service/comment";
import CommentCard from "../comment/CommentCard";
import CommentForm from "../comment/CommentForm";
import { adoptionDelete } from "@/api/adoption/adoption";
import { useRouter } from "next/navigation";
import { GetAuctionPostsView } from "@/service/my/auction";
import {
  auctionDelete,
  auctionWrite,
  streamKeyEdit,
  auctionDeleteBookmark,
  auctionRegisterBookmark,
} from "@/api/auction/auction";
import { useReGenerateTokenMutation } from "@/api/accesstoken/regenerate";

import { io, Socket } from "socket.io-client";
import Swal from "sweetalert2";
import BidItem from "../chat/BidItem";

import {
  chatRoomState,
  chatRoomVisisibleState,
  chatNowInfoState,
  isNewChatState,
  isNewChatIdxState,
} from "@/recoil/chatting";
import {
  IMessage,
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
    webkit?: any;
  }
}

export default function AuctionPostsView() {
  const router = useRouter();
  const params = useParams();
  const idx = params?.idx;
  const pathName = usePathname() || "";

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

  const [bidMsg, setBidMsg] = useState("");
  const [chattingBidData, setchattingBidData] = useState<IMessage[]>([]);
  let auctionRoomIdx = useRef<string>();
  const socketBidRef = useRef<Socket | null>(null);
  const [biddingState, setbiddingState] = useState<boolean>(false);
  const [userInfoBidData, setUserInfoBidData] = useState<userInfo[]>([]); //유저 정보 가지고 있는 리스트
  const [nowBid, setNowBid] = useState("0"); // 현재 최대 입찰가
  const [bidUnit, setBidUnit] = useState(""); // 입찰 단위
  const [bidStartPrice, setBidStartPrice] = useState(""); // 입찰 시작가

  const [userIdx, setUserIdx] = useState<number>(0); // 로그인 한 유저의 userIdx 저장
  const [nickname, setNickname] = useState(""); // 유저의 nickname 저장
  const [profilePath, setProfilePath] = useState(""); // 유저의 profilePath 저장
  const [roomName, setroomName] = useState("");
  const bidContainerRef = useRef<HTMLDivElement | null>(null);
  const [roomEnter, setroomEnter] = useState<boolean>(false);
  const [bidVisible, setBidVisible] = useState<boolean>(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [endTime, setEndTime] = useState("");
  const [streamKey, setStreamKey] = useState("");

  const [userAuth, setUserAuth] = useState("guest"); //유저 권한
  const [host, setHost] = useState(0); //방장 유무: 게시글 작성자의 idx로 지정
  const [countdown, setCountdown] = useState("");
  const [userInfoData, setUserInfoData] = useState<userInfo[]>([]); //유저 정보 가지고 있는 리스트

  const [commentCnt, setCommentCnt] = useState(0);
  const [bookmarkCnt, setBookmarkCnt] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

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
      const accessToken = myAppCookie.accessToken;
      const idx = parseInt(myAppCookie.idx || "", 10) || 0;
      const refreshToken = myAppCookie.refreshToken;
      const nickname = myAppCookie.nickname;
      const profilePath = myAppCookie.profilePath;

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
        const match = pathName.match(/\/auction\/posts\/(\d+)/);
        const extractedNumber = match ? match[1] : "";
        setroomName(extractedNumber);

        setUserIdx(userData.USER_DATA.idx);
        setNickname(userData.USER_DATA.nickname);
        setProfilePath(userData.USER_DATA.profilePath);
      } else {
      }
    }
  }, []);

  const deleteMutation = useMutation({
    mutationFn: auctionDelete,
    onSuccess: (data) => {
      Swal.fire({
        text: "게시글이 삭제되었습니다.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
      router.replace("/auction");
    },
  });
  /*********************
   *
   *       북마크
   *
   ********************/
  const bookmarkClick = () => {
    if (bookmarked) {
      setBookmarked(false);
      setBookmarkCnt(bookmarkCnt-1);
      auctionDeleteMutation.mutate({
        userAccessToken: accessToken,
        boardIdx: data!.result.boardAuction.boardIdx
      });
    } else {
      setBookmarked(true);
      setBookmarkCnt(bookmarkCnt+1);
      auctionRegisterMutation.mutate({
        userAccessToken: accessToken,
        boardIdx: data!.result.boardAuction.boardIdx,
        userIdx: userIdx
      });
    }
  };
  // 북마크 등록
  const auctionRegisterMutation = useMutation({
    mutationFn: auctionRegisterBookmark,
    onSuccess: (data) => {
    },
  });
  // 북마크 삭제
  const auctionDeleteMutation = useMutation({
    mutationFn: auctionDeleteBookmark,
    onSuccess: (data) => {
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
    checkChatRoom(accessToken);
    console.log("accesscode? : ", accessToken);
  };
  function intoChatting(
    idx: number,
    nickname: string,
    roomName: number,
    profilePath: string
  ) {
    setchatRoomVisisibleState(true);
    setchatNowInfo({
      idx: idx,
      nickname: nickname,
      roomName: roomName,
      profilePath: profilePath,
    });
  }
  const checkChatRoom = async (accessToken: string) => {
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
          post.UserInfo.idx,
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
                  checkChatRoom(accessToken);
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
          }
        }
      } else if (error.response.status == 404) {
        // 개설된 채팅방이 없는 경우 첫 채팅 state 지정하여 보냄
        if (error.response.data.errorCode === "CHATROOM_NOT_EXIST") {
          setchatRoomVisisibleState(true);
          setisNewChatState(true);
          if (post?.UserInfo.idx) {
            setisNewChatIdx(post?.UserInfo.idx);
            intoChatting(
              post.UserInfo.idx,
              post.UserInfo.nickname,
              0,
              post.UserInfo.profilePath
            );
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

  const options = {
    threshold: 1.0,
  };
  // 숫자 사이에 , 기입
  function formatNumberWithCommas(input: string): string {
    // 문자열을 숫자로 변환하고 세 자리마다 쉼표를 추가
    const numberWithCommas = Number(input).toLocaleString();
    return numberWithCommas;
  }
  const getData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/board/${idx}?userIdx=${currentUserIdx}`
      );
      setCommentCnt(response.data.result.commentCnt);
      setBookmarkCnt(response.data.result.bookmarkCounts);
      setBookmarked(response.data.result.hasBookmarked);

      setData(response.data);
      console.log("==========getData : view.tsx===========");
      console.log("*");
      console.log(response.data);
      console.log("*");
      console.log("========================================");
      if (response.data.result.UserInfo.idx === userIdx) {
        setIsInputDisabled(true);
      }
      setStreamKey(response.data.result.boardAuction.streamKey);
      setNowBid(
        formatNumberWithCommas(response.data.result.boardAuction.currentPrice)
      );
      setBidUnit(
        formatNumberWithCommas(response.data.result.boardAuction.unit)
      );
      setBidStartPrice(
        formatNumberWithCommas(response.data.result.boardAuction.startPrice)
      );

      setHost(response.data.result.UserInfo.idx);

      if (parseInt(response.data.result.UserInfo.idx) === userIdx) {
        setUserAuth("host");
      }

      setEndTime(response.data.result.boardAuction.endTime);
      const endTime1 = new Date(
        response.data.result.boardAuction.endTime
      ).getTime();

      const updateCountdown = () => {
        const currentTime = new Date().getTime();
        const timeRemaining = endTime1 - currentTime;

        if (timeRemaining < 0) {
          setCountdown("경매가 종료되었습니다!");
          clearInterval(countdownInterval);
          setIsInputDisabled(true);
        } else {
          const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

          setCountdown(
            "종료시간 : " + `${hours}시간 ${minutes}분 ${seconds}초`
          );
        }
      };

      updateCountdown(); // Initial call to set the countdown
      const countdownInterval = setInterval(updateCountdown, 1000);

      return () => {
        clearInterval(countdownInterval);
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    getData();
    getCommentData();
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
        `${process.env.NEXT_PUBLIC_API_URL}/board/${idx}/comment?page=${page}&size=20&order=DESC`
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

  const streamKeyMutation = useMutation({
    mutationFn: streamKeyEdit,
    onSuccess: (data) => {
      Swal.fire({
        text: "스트림키가 재생성 되었습니다.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
      setStreamKey(data.data.result);
    },
    onError: (data: string) => {
      Swal.fire({
        text: data,
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
    },
  });

  //스트림 키를 재설정하는 코드
  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const confirmation = window.confirm(
      "스트림키는 방송을 고유하게 식별하는 데 사용되는 키값입니다.\n각 게시물마다 고유한 스트림키 값이 존재하며, 작성자는 보안을 위해 언제든지 스트림키를 재설정 할 수 있습니다.\n스트림키를 재설정 하시겠습니까?"
    );

    if (confirmation) {
      let streamKey = "";
      const len: number = 5;
      for (let i = 1; i <= len; i++) {
        const charset = Array.from(
          "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        ) as string[];
        const rangeRandom = Array.from(
          { length: 4 },
          () => charset[Math.floor(Math.random() * charset.length)]
        ).join("");
        streamKey += rangeRandom;
        if (i < len) {
          streamKey += "-";
        }
      }

      const requestData = {
        boardAuctionIdx: data?.result.boardAuction.idx || 0,
        streamKey: streamKey,
        userAccessToken: userAccessToken || "",
      };

      streamKeyMutation.mutate(requestData);
    }
  };

  //댓글 작성 성공 시,
  const mutation = useMutation({
    mutationFn: commentWrite,
    onSuccess: (data) => {
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
      setCommentCnt(commentCnt + 1);
    },
    onError: async (error: unknown) => {
      if (isAxiosError(error) && error.response?.data.status === 401) {
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
                  userAccessToken = data1;
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

                    Swal.fire({
                      text: alertMessage,
                      confirmButtonText: "확인", // confirm 버튼 텍스트 지정
                      confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
                    });
                  }
                },
                onError: () => {
                  router.replace("/login");
                  Swal.fire({
                    text: "로그인 만료\n다시 로그인 해주세요",
                    confirmButtonText: "확인", // confirm 버튼 텍스트 지정
                    confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
                  });
                },
              }
            );
          } else {
            router.replace("/login");
            Swal.fire({
              text: "로그인이 필요한 기능입니다.",
              confirmButtonText: "확인", // confirm 버튼 텍스트 지정
              confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
            });
          }
        }
      }
    },
  });
  useEffect(() => {
    joinBidRoom();
    fetchBidData();
  }, [data]);

  /*************************************
   *
   *  경매 입찰 관련
   *
   *************************************/
  //방에 들어왔을 때 작동하는 함수
  const joinBidRoom = () => {
    const socketBid = io("https://socket.reptimate.store/AuctionChat", {
      path: "/socket.io",
    });
    // log socket connection
    socketBidRef.current = socketBid;
    socketBid.on("connect", () => {
      const message: IMessage = {
        userIdx: userIdx,
        socketId: socketBid.id,
        message: bidMsg.trim(),
        room: roomName,
      };
      if (socketBidRef.current) {
        socketBidRef.current.emit("join-room", message);
      }
      setroomEnter(true);
    });
    // 메시지 리스너
    socketBid.on("Auction_message", (message: IMessage) => {
      setchattingBidData((chattingData) => [...chattingData, message]);
      if (bidContainerRef.current) {
        bidContainerRef.current.scrollTop =
          bidContainerRef.current.scrollHeight;
      }
      setNowBid(formatNumberWithCommas(message.message));
    });
    socketBid.on("Auction_End", (message: string) => {});
    socketBid.on("error", (message: string) => {});
    //경매 입찰과 동시에 입찰자 명단 정보를 추가하는 리스너
    socketBid.on("auction_participate", (message: userInfo) => {
      setUserInfoBidData((prevUserInfoData) => ({
        ...prevUserInfoData,
        [message.userIdx]: {
          userIdx: message.userIdx,
          profilePath: message.profilePath,
          nickname: message.nickname,
        },
      }));
    });
    // socket disconnect on component unmount if exists
    return () => {
      if (socketBidRef.current) {
        socketBidRef.current.disconnect();
        socketBidRef.current = null;
      }
    };
  };
  //서버에 채팅 내역을 불러오는 요청 - 20개씩 불러온다.
  const fetchBidData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CHAT_URL}/auctionChat/${roomName}?page=1&size=20&order=DESC`
      );
      const userInfoArray = response.data.result.userInfo;
      const resultData = response.data.result.list;
      const userInfoData = userInfoArray.map((user: string) => {
        const { userIdx, profilePath, nickname } = JSON.parse(user);
        return { [userIdx]: { userIdx, profilePath, nickname } };
      });
      const userDataObject = Object.assign({}, ...userInfoData);
      setUserInfoBidData(userDataObject);
      const messages: IMessage[] = resultData
        .map((item: any) => ({
          userIdx: item.userIdx,
          socketId: item.socketId,
          message: item.message,
          room: item.room,
        }))
        .reverse();
      setchattingBidData(messages);
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1].message;
        setNowBid(formatNumberWithCommas(lastMessage));
      } else {
      }
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };
  const fetchParticipate = async () => {
    try {
      // 참여자 명단 추가 -> 나중에 jwt토큰 완성되면 userIdx 빼주시면 됩니다. userId는 jwt토큰으로 조회 가능합니다.
      await axios.post(`${process.env.NEXT_PUBLIC_CHAT_URL}/AuctionChat/bid`, {
        auctionIdx: roomName,
        userIdx: userIdx,
      });
      // 알람 받기 On 요청 -> 나중에 jwt토큰 완성되면 userIdx 빼주시면 됩니다. userId는 jwt토큰으로 조회 가능합니다.
      await axios.post(
        `${process.env.NEXT_PUBLIC_CHAT_URL}/AuctionChat/${roomName}`,
        {
          action: "on",
          userIdx: userIdx,
        }
      );
      //메시지 발송
      if (socketBidRef.current) {
        const message = {
          userIdx: userIdx,
          profilePath: profilePath,
          nickname: nickname,
          room: roomName,
        };
        socketBidRef.current.emit("auction_participate", message);
        setBidMsg("");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //메시지 발송하는 함수
  const sendBidMsg = async () => {
    if (bidMsg.trim() !== "") {
      const numericValue = parseInt(bidMsg.trim(), 10);

      if (numericValue % parseInt(bidUnit) !== 0) {
        // 입력값이 1000의 배수가 아니면 초기화
        Swal.fire({
          text: "입찰 단위를 확인해 주시기 바랍니다.",
          icon: "error",
          confirmButtonText: "확인", // confirm 버튼 텍스트 지정
          confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
        });
        return;
      }
      if (parseInt(bidMsg.trim()) < parseInt(bidStartPrice)) {
        Swal.fire({
          text: "입찰 시작가 보다 큰 금액을 입력해 주세요",
          icon: "error",
          confirmButtonText: "확인", // confirm 버튼 텍스트 지정
          confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
        });
        return;
      }
      if (!biddingState) {
        await fetchParticipate();
      }
      if (socketBidRef.current) {
        const socketId = socketBidRef.current.id;
        const message: IMessage = {
          userIdx: userIdx,
          socketId: socketId,
          message: bidMsg.trim(),
          room: roomName,
        };
        socketBidRef.current.emit("Auction_message", message);
        setBidMsg("");
      }
    }
  };

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

        Swal.fire({
          text: alertMessage,
          confirmButtonText: "확인", // confirm 버튼 텍스트 지정
          confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
        });
      }
    };

    const handleCommentDelete = (commentIdx: number) => {
      // Filter out the deleted comment
      const updatedCommentList = commentList?.filter(
        (comment) => comment.idx !== commentIdx
      );

      // Update the comment list in the parent component
      setCommentList(updatedCommentList);
      setCommentCnt(commentCnt - 1);
    };

    const handleReplyWrite = () => {
      setCommentCnt(commentCnt + 1);
    };

    const handleReplyDelete = () => {
      setCommentCnt(commentCnt - 1);
    };

    const isCurrentUserComment = currentUserIdx === post.UserInfo.idx;

    const handleChatClick = () => {
      //현재 경매의 실시간 입찰을 볼 수 있는 버튼
      setBidVisible(true);
    };
    const onChangeBid = (event: { target: { value: string } }) => {
      const numericInput = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
      setBidMsg(numericInput);
    };

    const handleViewClick = () => {
      //라이브 방송에 시청자로 참가
      location.href = `/auction/posts/${idx}/live`;
    };



    const handleLiveClick = () => {
      //웹뷰에서 버튼 클릭시 안드로이드 rtmp 송신 액티비티로 이동
      if (window.Android) {
        window.Android.openNativeActivity(idx, streamKey);
      } else if (window.webkit) {
        window.webkit?.messageHandlers.openNativeActivity.postMessage({
          idx: idx,
          streamKey: streamKey,
        });
      }
    };

    function chattingClose() {
      setBidVisible(false);
    }

    function BackButton() {
      const handleGoBack = () => {
        window.history.back(); // Go back to the previous page using window.history
      };
      return (
        <button
          onClick={handleGoBack}
          className="cursor-poiter px-2 font-bold mt-12"
        >
          &lt; 뒤로가기
        </button>
      );
    }
    return (
      <div className="mx-1">
        {post && (
          <div className="max-w-screen-sm mx-auto">
            <PC>
              <h2 className="text-4xl font-bold pt-10 mt-20">{post.title}</h2>
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
                <p className="text-xl font-bold ml-auto mr-5">{nowBid}원</p>
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
              <div className="flex flex-row items-center justify-center mt-1">
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
              <p className="text-lg my-7 break-all">{post.description}</p>
              <hr className="border-t border-gray-300 my-1" />
              <div className="flex flex-row justify-between items-center py-3">
                <div className="flex flex-row items-center py-3">
                  <p className="text-lg font-semibold ml-1 mr-2">댓글</p>
                  <p className="text-lg font-semibold mr-2">{commentCnt}개</p>
                </div>
                <div className="flex flex-row items-center py-3">
                {bookmarked ? (
                  <a onClick={bookmarkClick}>
                    <Image
                      src={like_maincolor}
                      width={20}
                      height={20}
                      alt="북마크"
                      className="like_btn m-auto mr-1"
                    />
                  </a>
                  ) : (
                    <a onClick={bookmarkClick}>
                      <Image
                        src={unlike_black}
                        width={20}
                        height={20}
                        alt="북마크"
                        className="like_btn m-auto mr-1"
                      />
                    </a>
                  )}
                  <p className="text-lg font-semibold mr-2">{bookmarkCnt}</p>
                </div>
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
              <div className="flex flex-row items-center py-1">
                <p className="font-semibold ml-2">현재 경매가</p>
                <p className="font-bold ml-auto mr-2">{nowBid}원</p>
              </div>
              <div className="flex flex-row items-center py-1">
                <p className="font-semibold ml-2">즉시 구입가</p>
                <p className="font-bold ml-auto mr-2">
                  {post.boardAuction.startPrice.toLocaleString()}원
                </p>
              </div>
              <div className="flex flex-row items-center py-1">
                <p className="font-semibold ml-2">마감 시간</p>
                <p className="font-bold ml-auto mr-2">
                  {post.boardAuction.endTime}까지
                </p>
              </div>
              <div className="my-1 mx-1 flex flex-row items-center justify-center">
                <div className="w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 font-bold">시작 가격</p>
                  <p className="pb-1 text-md">
                    {post.boardAuction.startPrice}원
                  </p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 font-bold">경매 단위</p>
                  <p className="pb-1 text-md">{post.boardAuction.unit}원</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 font-bold">마감 룰</p>
                  <p className="pb-1 text-md">
                    {post.boardAuction.extensionRule === 1 ? "적용" : "미적용"}
                  </p>
                </div>
              </div>
              <div className="my-1 mx-1 flex flex-row items-center justify-center">
                <div className="w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 font-bold">품종</p>
                  <p className="pb-1 text-md">{post.boardAuction.variety}</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 font-bold">성별</p>
                  <p className="pb-1 text-md">{post.boardAuction.gender}</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 font-bold">크기</p>
                  <p className="pb-1 text-md">{post.boardAuction.size}</p>
                </div>
              </div>
              <div className="my-1 mx-1 flex flex-row items-center justify-center">
                <div className="w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 font-bold">모프</p>
                  <p className="pb-1 text-md">{post.boardAuction.pattern}</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 font-bold">출생</p>
                  <p className="pb-1 text-md">{post.boardAuction.birthDate}</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 font-bold">상태</p>
                  {post.boardAuction.state === "reservation" ? (
                    <p className="pb-1 text-md text-red-600">예약중</p>
                  ) : post.boardAuction.state === "end" ? (
                    <p className="pb-1 text-md text-gray-500">판매완료</p>
                  ) : (
                    <p className="pb-1 text-md text-blue-600">판매중</p>
                  )}
                </div>
              </div>
              <p className="mx-2 my-4 break-all">{post.description}</p>
              <hr className="border-t border-gray-300" />
              <div className="flex flex-row justify-between items-center py-3">
                <div className="flex flex-row items-center py-3">
                  <p className="text-lg font-semibold ml-1 mr-2">댓글</p>
                  <p className="text-lg font-semibold mr-2">{commentCnt}개</p>
                </div>
                <div className="flex flex-row items-center py-3">
                {bookmarked ? (
                  <a onClick={bookmarkClick}>
                    <Image
                      src={like_maincolor}
                      width={20}
                      height={20}
                      alt="북마크"
                      className="like_btn m-auto mr-1"
                    />
                  </a>
                  ) : (
                    <a onClick={bookmarkClick}>
                      <Image
                        src={unlike_black}
                        width={20}
                        height={20}
                        alt="북마크"
                        className="like_btn m-auto mr-1"
                      />
                    </a>
                  )}
                  <p className="text-lg font-semibold mr-2">{bookmarkCnt}</p>
                </div>
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
                {isCurrentUserComment && (
                  <form onSubmit={onSubmitHandler}>
                    <button
                      className="w-16 h-16 rounded-full bg-main-color text-white flex justify-center items-center text-sm font-bold mb-2"
                      type="submit"
                    >
                      스트림키{"\n"}재설정
                    </button>
                  </form>
                )}
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

              <div
                className={`${
                  bidVisible
                    ? "bg-white w-[450px] h-[500px] z-[9999] fixed bottom-0 border-[2px] rounded-t-[10px] border-gray-300 right-[40px] flex flex-col shadow-md"
                    : "hidden"
                }`}
              >
                <div className="border-b-[1px] border-gray-300 h-[40px] flex justify-between">
                  <p className="text-[20px] text-black self-center ml-[16px] pt-[2px]">
                    입찰
                  </p>
                  <button
                    className="right-0"
                    type="button"
                    onClick={chattingClose}
                  >
                    <img
                      className="w-[15px] h-[15px] self-center mr-[18px]"
                      src="/img/ic_x.png"
                    />
                  </button>
                </div>
                <span className="flex text-center self-center items-center justify-center mx-auto">
                  {countdown}
                </span>
                <div className="flex flex-col min-h-[10vh] max-h-[10vh] w-full text-sm bg-gray-100 border-y-[1px] border-gray-30 py-[10px] px-[5px] justify-center">
                  <div className="flex flex-row w-full mb-[5px]">
                    <div className="flex flex-row pl-[3px] basis-1/2">
                      <p className="text-[14px]">입찰 시작가 : </p>
                      <p className="text-[14px] px-1 text-main-color font-semibold">
                        {bidStartPrice}
                      </p>
                      <p className="text-[14px]"> 원</p>
                    </div>
                    <div className="flex flex-row pl-[3px] basis-1/2">
                      <p className="text-[14px]">입찰 단위 : </p>
                      <p className="text-[14px] px-1 text-main-color font-semibold">
                        {bidUnit}
                      </p>
                      <p className="text-[14px]"> 원</p>
                    </div>
                  </div>
                  <div className="flex flex-row pl-[3px] pt-[5px] basis-1/2">
                    <p className="text-[18px]">현재 입찰 : </p>
                    <p className="text-[18px] px-1 text-main-color font-semibold">
                      {nowBid}
                    </p>
                    <p className="text-[17px]"> 원</p>
                  </div>
                </div>

                <div className="flex-1 w-full border-gray-100 border-r-[1px]">
                  <div className="flex-1 h-[280px] overflow-auto bg-white pb-1">
                    {chattingBidData.map((chattingBidData, i) => (
                      <BidItem
                        chatData={chattingBidData}
                        userIdx={userIdx}
                        userInfoData={userInfoBidData[chattingBidData.userIdx]}
                        key={i}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex border-[#A7A7A7] text-sm w-full pl-[2px] absolute bottom-0">
                  <input
                    className="w-full h-12 px-4 py-2 border border-gray-300 rounded"
                    onChange={onChangeBid}
                    value={bidMsg}
                    placeholder=""
                    disabled={isInputDisabled}
                  />
                  <button
                    className="w-[20%] h-12 bg-main-color text-white rounded transition duration-300 ml-1"
                    onClick={sendBidMsg}
                    disabled={isInputDisabled}
                  >
                    입찰
                  </button>
                </div>
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
                      <form onSubmit={onSubmitHandler}>
                        <button
                          className="w-14 h-14 rounded-full bg-main-color text-white flex justify-center items-center text-[12px] font-bold mb-1"
                          type="submit"
                        >
                          스트림키{"\n"}재설정
                        </button>
                      </form>
                    )}
                    {isCurrentUserComment ? (
                      <button
                        className="w-14 h-14 rounded-full bg-main-color text-white flex justify-center items-center text-[12px] font-bold mb-1"
                        onClick={handleLiveClick}
                      >
                        방송하기
                      </button>
                    ) : (
                      <button
                        className="w-14 h-14 rounded-full bg-main-color text-white flex justify-center items-center text-[20px] font-bold mb-1"
                        onClick={handleViewClick}
                      >
                        Live
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

              <div
                className={`${
                  bidVisible
                    ? "bg-white w-full h-[500px] z-[9999] fixed bottom-0 border-[2px] rounded-t-[10px] border-gray-300 flex flex-col shadow-md"
                    : "hidden"
                }`}
              >
                <div className="border-b-[1px] border-gray-300 h-[40px] flex justify-between">
                  <p className="text-[20px] text-black self-center ml-[16px] pt-[2px]">
                    입찰
                  </p>
                  <button
                    className="right-0"
                    type="button"
                    onClick={chattingClose}
                  >
                    <img
                      className="w-[15px] h-[15px] self-center mr-[18px]"
                      src="/img/ic_x.png"
                    />
                  </button>
                </div>

                <span className="flex text-center self-center items-center justify-center mx-auto">
                  {countdown}
                </span>
                <div className="flex flex-col min-h-[10vh] max-h-[10vh] w-full text-sm bg-gray-100 border-y-[1px] border-gray-30 py-[10px] px-[5px] justify-center">
                  <div className="flex flex-row w-full mb-[5px]">
                    <div className="flex flex-row pl-[3px] basis-1/2">
                      <p className="text-[14px]">입찰 시작가 : </p>
                      <p className="text-[14px] px-1 text-main-color font-semibold">
                        {bidStartPrice}
                      </p>
                      <p className="text-[14px]"> 원</p>
                    </div>
                    <div className="flex flex-row pl-[3px] basis-1/2">
                      <p className="text-[14px]">입찰 단위 : </p>
                      <p className="text-[14px] px-1 text-main-color font-semibold">
                        {bidUnit}
                      </p>
                      <p className="text-[14px]"> 원</p>
                    </div>
                  </div>
                  <div className="flex flex-row pl-[3px] pt-[5px] basis-1/2">
                    <p className="text-[18px]">현재 입찰 : </p>
                    <p className="text-[18px] px-1 text-main-color font-semibold">
                      {nowBid}
                    </p>
                    <p className="text-[17px]"> 원</p>
                  </div>
                </div>
                <div className="flex-1 w-full border-gray-100 border-r-[1px]">
                  <div className="flex-1 h-[285px] overflow-auto bg-white pb-1">
                    {chattingBidData.map((chattingBidData, i) => (
                      <BidItem
                        chatData={chattingBidData}
                        userIdx={userIdx}
                        userInfoData={userInfoData[chattingBidData.userIdx]}
                        key={i}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex border-[#A7A7A7] text-sm w-full pl-[2px]  absolute bottom-0">
                  <input
                    className="w-full h-12 px-4 py-2 border border-gray-300 rounded"
                    onChange={onChangeBid}
                    value={bidMsg}
                    placeholder=""
                    disabled={isInputDisabled}
                  />
                  <button
                    className="w-[20%] h-12 bg-main-color text-white rounded transition duration-300 ml-1"
                    onClick={sendBidMsg}
                    disabled={isInputDisabled}
                  >
                    입찰
                  </button>
                </div>
              </div>
            </Mobile>

            <ul className="mt-6">
              {commentList !== null && commentList ? (
                commentList.map((comment) => (
                  <li key={comment.idx}>
                    <CommentCard
                      comment={comment}
                      onDelete={handleCommentDelete}
                      onReplyWrite={handleReplyWrite}
                      onReplyDelete={handleReplyDelete}
                    />
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
