"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { GetAuctionPostsView, GetAuctionPostsBid } from "@/service/my/auction";

import ChatItem from "../chat/ChatItem";
import BidItem from "../chat/BidItem";
import ChatUserList from "../chat/ChatUserList";

import {
  IMessage,
  connectMessage,
  Ban_Message,
  userInfo,
} from "@/service/chat/chat";
import axios from "axios";
import Swal from "sweetalert2";

interface UserInfoData {
  [userIdx: string]: {
    userIdx: number;
    nickname: string;
    profilePath: string;
  };
}
interface banUserInfo {
  idx: number;
  nickname: string;
  profilePath: string;
}
export default function StreamingChatView() {
  const router = useRouter();
  const params = useParams();
  const idx = params?.idx;
  const pathName = usePathname() || "";

  const [postsData, setPostsData] = useState<GetAuctionPostsView>();
  const [endTime, setEndTime] = useState("");

  const [roomEnter, setroomEnter] = useState<boolean>(false);
  const [textMsg, settextMsg] = useState("");
  const [roomName, setroomName] = useState("");
  const [chattingData, setchattingData] = useState<IMessage[]>([]);
  const [banList, setBanList] = useState<banUserInfo[]>([]);
  const [noChatList, setNoChatList] = useState<banUserInfo[]>([]);
  const socketRef = useRef<Socket | null>(null);
  let liveRoomIdx = useRef<string>();

  const [bidMsg, setBidMsg] = useState("");
  const [chattingBidData, setchattingBidData] = useState<IMessage[]>([]);
  let auctionRoomIdx = useRef<string>();
  const socketBidRef = useRef<Socket | null>(null);
  const [biddingState, setbiddingState] = useState<boolean>(false);
  const [userInfoBidData, setUserInfoBidData] = useState<userInfo[]>([]); //유저 정보 가지고 있는 리스트
  const [nowBid, setNowBid] = useState("0"); // 현재 최대 입찰가
  const [bidUnit, setBidUnit] = useState(""); // 입찰 단위
  const [bidStartPrice, setBidStartPrice] = useState(""); // 입찰 시작가

  const [userList, setUserList] = useState<UserInfoData>({}); //현재 참여자 목록
  const [viewerCount, setviewerCount] = useState(0);
  const [host, setHost] = useState(0); //방장 유무: 게시글 작성자의 idx로 지정
  const [boardIdx, setBoardIdx] = useState(0); //게시글 번호: 현재 하드코딩 -> 나중에 방 입장 시, props로 들고와야함
  const [userAuth, setUserAuth] = useState("guest"); //유저 권한
  const [noChatState, setNoChatState] = useState<boolean>(false); //유저 권한

  const [accessToken, setAccessToken] = useState("");

  const [userInfoData, setUserInfoData] = useState<userInfo[]>([]); //유저 정보 가지고 있는 리스트

  const [userIdx, setUserIdx] = useState<number>(0); // 로그인 한 유저의 userIdx 저장
  const [nickname, setNickname] = useState(""); // 유저의 nickname 저장
  const [profilePath, setProfilePath] = useState(""); // 유저의 profilePath 저장

  const [sideView, setSideView] = useState("chat");

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const bidContainerRef = useRef<HTMLDivElement | null>(null);
  const [countdown, setCountdown] = useState("");

  const [isInputDisabled, setIsInputDisabled] = useState(false); // 채팅 입력란 입력 가능여부

  useEffect(() => {
    const storedData = localStorage.getItem("recoil-persist");
    const handleBackNavigation = (event: any) => {
      event.preventDefault(); // 브라우저의 기본 동작을 막음
      router.back(); // 뒤로가기 동작 실행
    };
    window.addEventListener("popstate", handleBackNavigation);

    if (storedData) {
      const userData = JSON.parse(storedData);
      if (userData.USER_DATA.accessToken) {
        const match = pathName.match(/\/auction\/posts\/(\d+)\/live/);
        const extractedNumber = match ? match[1] : "";
        // 참가한 스트리밍의 방 번호(boardidx)로 채팅 입장
        setroomName(extractedNumber);
        setBoardIdx(parseInt(extractedNumber));
        const extractedAccessToken = userData.USER_DATA.accessToken;
        setAccessToken(extractedAccessToken);
        //입장한 사용자의 idx지정
        setUserIdx(userData.USER_DATA.idx);
        getData().then(() => {
          // getData가 완료된 후 실행하려는 코드를 이곳에 배치
          // 입장한 사용자의 이름 지정
          setNickname(userData.USER_DATA.nickname);
          setProfilePath(userData.USER_DATA.profilePath);
        });
        fetchBanList();
        fetchNoChatList();
      } else {
        router.replace("/");
        alert("로그인이 필요한 기능입니다.");
      }
    }
    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
    };
  }, []);

  useEffect(() => {
    const chatContainer = bidContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chattingBidData]);

  const getData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/board/${idx}?macAdress=`
      );
      console.log(
        "========getData() : 경매글 정보 불러오기===================="
      );
      console.log(response.data);
      console.log("============================");
      setPostsData(response.data);
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
        console.log("당신은 이 방송의 host입니다.======================");
      }

      setNowBid(
        formatNumberWithCommas(response.data.result.boardAuction.currentPrice)
      );
      setBidUnit(
        formatNumberWithCommas(response.data.result.boardAuction.unit)
      );
      setBidStartPrice(
        formatNumberWithCommas(response.data.result.boardAuction.startPrice)
      );
      setEndTime(response.data.result.boardAuction.endTime);
      console.log(response.data.result.boardAuction.endTime);

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
    console.log("useEffect  :  profilePath  :  소켓 연결 시도================");
    joinRoom();
    joinBidRoom();
  }, [profilePath]);
  useEffect(() => {
    if (userIdx === host) {
      setUserAuth("host");
    }
  }, [host]);

  //입찰가 입력란
  const onChangeBid = (event: { target: { value: string } }) => {
    const numericInput = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setBidMsg(numericInput);
  };
  // 숫자 사이에 , 기입
  function formatNumberWithCommas(input: string): string {
    // 문자열을 숫자로 변환하고 세 자리마다 쉼표를 추가
    const numberWithCommas = Number(input).toLocaleString();
    return numberWithCommas;
  }

  //방에 들어왔을 때 작동하는 함수
  const joinRoom = () => {
    const socket = io("https://socket.reptimate.store/LiveChat", {
      path: "/socket.io",
    });
    // log socket connection
    socketRef.current = socket;
    socket.on("connect", () => {
      const message: connectMessage = {
        userIdx: userIdx,
        socketId: socket.id,
        message: textMsg.trim(),
        room: roomName,
        profilePath: profilePath,
        nickname: nickname,
      };
      if (socketRef.current) {
        console.log("=============실시간 채팅 입장===========");
        socketRef.current.emit("join-live", message);
      }
      setroomEnter(true);
    });
    // 메시지 리스너
    socket.on("live_message", (message: IMessage) => {
      console.log("live_message  :  ================");
      console.log(message);
      console.log("=============================");
      setchattingData((chattingData) => [...chattingData, message]);
    });
    //강퇴 처리
    socket.on("ban-user", (message: IMessage) => {
      if (message.userIdx === userIdx) {
        roomOut();
        Swal.fire({
          text: "방송에서 추방 당했습니다.",
          icon: "warning",
          confirmButtonText: "완료",
          confirmButtonColor: "#7A75F7",
        });
      } else {
        setUserList((prevUserList) => {
          const newData: { [key: number]: any } = { ...prevUserList };
          delete newData[message.userIdx];
          return newData;
        });
      }
      setroomEnter(false);
    });
    //강퇴 당한 이후에 재입장 시도 후 밴 유무를 알리는 리스너
    socket.on("ban-notification", (message: string) => {
      setroomEnter(false);
      Swal.fire({
        text: "해당 방송 입장 금지를 당하셨습니다.",
        icon: "error",
        confirmButtonText: "완료", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
      router.replace("/auction/posts/" + boardIdx);
    });
    //다른 참여자가 방을 나갔을 때
    socket.on("leave-user", (message: IMessage) => {
      // console.log("message", message);
      setUserList((prevUserList) => {
        const newData: { [key: number]: any } = { ...prevUserList };
        delete newData[message.userIdx];
        return newData;
      });
    });
    //채팅 금지 리스너
    socket.on("no_chat", (message: string) => {
      // console.log("noChatIdx");
      Swal.fire({
        text: "채팅 금지를 받았습니다.",
        icon: "warning",
        confirmButtonText: "완료", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
      setNoChatState(true);
    });
    //채팅 금지 해제 리스너
    socket.on("no_chat_delete", (message: IMessage) => {
      if (message.userIdx === userIdx) {
        setNoChatState(false);
      }
    });
    //참여자 정보를 추가하는 리스너
    socket.on("live_participate", (message: any) => {
      if (userIdx === host) {
        setUserAuth("host");
      }
      if (Array.isArray(message)) {
        const parsedDataArray = message.map((data) => JSON.parse(data));
        console.log("===========live_participate : =======");
        console.log(parsedDataArray);
        console.log(message);
        console.log("====================================");

        parsedDataArray.forEach((data: any) => {
          const getUserInfo = data;
          if (
            getUserInfo &&
            getUserInfo.profilePath &&
            getUserInfo.profilePath.length > 1
          ) {
            setUserInfoData((prevUserInfoData) => ({
              ...prevUserInfoData,
              [getUserInfo.userIdx]: {
                userIdx: getUserInfo.userIdx,
                profilePath: getUserInfo.profilePath,
                nickname: getUserInfo.nickname,
              },
            }));
            setUserList((prevsetUserList) => ({
              ...prevsetUserList,
              [getUserInfo.userIdx]: {
                userIdx: getUserInfo.userIdx,
                profilePath: getUserInfo.profilePath,
                nickname: getUserInfo.nickname,
              },
            }));
          } else {
          }
        });
      }
    });
    console.log(socket.connected);
    // socket disconnect on component unmount if exists
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  };
  //강퇴 시키기
  const ban = (banUserIdx: number) => {
    if (userAuth === "host") {
      if (socketRef.current) {
        const message: Ban_Message = {
          userIdx: userIdx,
          banUserIdx: banUserIdx,
          room: roomName,
          boardIdx: boardIdx,
        };
        socketRef.current.emit("user_ban", message);
      }
    }
  };
  //스트리밍 밴 목록 조회
  const fetchBanList = async () => {
    if (userAuth === "host") {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CHAT_URL}/LiveChat/ban/${roomName}/${boardIdx}/${userIdx}`
        );
        const userInfoArray = response.data.result;
        setBanList(userInfoArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      // Swal.fire({
      //   text: "방장이 아닙니다.",
      //   icon: "error",
      //   confirmButtonText: "완료", // confirm 버튼 텍스트 지정
      //   confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      // });
    }
  };
  //스트리밍 밴 풀기
  const fetchBanDelete = async (banUserIdx: number) => {
    if (userAuth === "host") {
      await axios.post(
        `${process.env.NEXT_PUBLIC_CHAT_URL}/LiveChat/ban/${roomName}/${boardIdx}/${userIdx}/${banUserIdx}`
      );
    } else {
      Swal.fire({
        text: "방장이 아닙니다.",
        icon: "error",
        confirmButtonText: "완료", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
    }
  };
  //채팅 금지 먹이기
  const noChat = (banUserIdx: number) => {
    // console.log("noChat");
    if (userAuth === "host") {
      // console.log(socketRef.current);
      if (socketRef.current) {
        console.log("==========noChat : " + banUserIdx + "=========");
        const message: Ban_Message = {
          userIdx: userIdx,
          banUserIdx: banUserIdx,
          room: roomName,
          boardIdx: boardIdx,
        };
        console.log(message);
        socketRef.current.emit("noChat", message);
      }
    }
  };
  //스트리밍 채팅 금지 풀기
  const noChatDelete = (banUserIdx: number) => {
    if (userAuth === "host") {
      // console.log(socketRef.current);
      if (socketRef.current) {
        // console.log("noChat");
        const message: Ban_Message = {
          userIdx: userIdx,
          banUserIdx: banUserIdx,
          room: roomName,
          boardIdx: boardIdx,
        };
        socketRef.current.emit("noChatDelete", message);
      }
      fetchnoChatDelete(banUserIdx);
    }
  };
  //스트리밍 채금 목록 조회
  const fetchNoChatList = async () => {
    if (userAuth === "host") {
      // console.log("no chat");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CHAT_URL}/LiveChat/nochat/${roomName}/${boardIdx}/${userIdx}`
        );
        const userInfoArray = response.data.result;
        setNoChatList(userInfoArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      // Swal.fire({
      //   text: "방장이 아닙니다.",
      //   icon: "error",
      //   confirmButtonText: "완료", // confirm 버튼 텍스트 지정
      //   confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      // });
    }
  };
  //스트리밍 채금 풀기 - db
  const fetchnoChatDelete = async (banUserIdx: number) => {
    if (userAuth === "host") {
      await axios.post(
        `http://localhost:3003/LiveChat/noChat/${roomName}/${boardIdx}/${userIdx}/${banUserIdx}`
      );
    } else {
      Swal.fire({
        text: "방장이 아닙니다.",
        icon: "error",
        confirmButtonText: "완료", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
    }
  };
  //메시지 발송하는 함수
  const sendMsg = async () => {
    if (textMsg.trim() === "") {
      return;
    }
    if (noChatState === true) {
      Swal.fire({
        text: "채팅 금지 상태입니다.",
        icon: "warning",
        confirmButtonText: "완료", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
      return;
    }
    if (socketRef.current) {
      const socketId = socketRef.current.id;
      const message: IMessage = {
        userIdx: userIdx,
        socketId: socketId,
        message: textMsg.trim(),
        room: roomName,
      };
      console.log("=============실시간 채팅 발송됨===========");
      socketRef.current.emit("live_message", message);
      settextMsg("");
    }
  };
  const roomOut = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("leave-room", {
        userIdx: userIdx,
        roomIdx: roomName,
      });
      socketRef.current.disconnect();
    }
    setroomEnter(false);
    setchattingData([]);
    setchattingBidData([]);
    setUserList({});
    setNoChatState(false);
    setchattingBidData([]);
  }, [socketRef, userIdx, roomName]);

  const onChangeKeyword = (e: { target: { value: string } }) => {
    const newValue = e.target.value;
    settextMsg(newValue);
  };

  useEffect(() => {
    const handleBeforeUnload = (event: {
      preventDefault: () => void;
      returnValue: string;
    }) => {
      roomOut();
      event.preventDefault();
      event.returnValue = ""; // Some browsers require this property to be set.
    };
    // beforeunload 이벤트 리스너를 등록합니다.
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // 컴포넌트가 언마운트 될 때 이벤트 리스너를 제거합니다.
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [roomOut]);

  useEffect(() => {
    liveRoomIdx.current = roomName;
    auctionRoomIdx.current = roomName;
  }, [roomName]);
  useEffect(() => {
    if (userInfoBidData[userIdx]) {
      setbiddingState(true);
    }
  }, [userInfoBidData]);
  useEffect(() => {
    // console.log("banList", banList);
  }, [banList]);
  useEffect(() => {
    console.log("userList", userList);
  }, [userList]);

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
        console.log("============경매 입찰 채팅 입장============");

        socketBidRef.current.emit("join-room", message);
      }
      setroomEnter(true);

      fetchBidData();
    });
    // 메시지 리스너
    socketBid.on("Auction_message", (message: IMessage) => {
      setchattingBidData((chattingData) => [...chattingData, message]);
      console.log("======경매 입찰 채팅 수신=======");
      console.log("bid message  :  ", message);
      console.log("========================");
      if (bidContainerRef.current) {
        bidContainerRef.current.scrollTop =
          bidContainerRef.current.scrollHeight;
      }
      setNowBid(message.message);
      console.log("bid message", message);
    });
    socketBid.on("Auction_End", (message: string) => {
      console.log("======경매 입찰 채팅 : 경매 종료=======");
      console.log("Auction_End message  :  ", message);
      console.log("============================");
    });
    socketBid.on("error", (message: string) => {
      console.log("======경매 입찰 채팅 에러 수신=======");
      console.log("error message", message);
      console.log("==============================");
    });
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
        `${process.env.NEXT_PUBLIC_CHAT_URL}/auctionChat/${auctionRoomIdx.current}?page=1&size=20&order=DESC`
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
    } catch (error) {
      console.error("Error fetching data:", error);
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
  function viewChat() {
    if (sideView != "chat") {
      setSideView("chat");
    }
  }
  function viewParticipate() {
    if (sideView != "participate") {
      setSideView("participate");
    }
  }
  function viewBid() {
    if (sideView != "bid") {
      setSideView("bid");
    }
  }
  return (
    <>
      <div className="flex-col w-full right-0 h-[87%] flex bg-white">
        <div className="flex-col py-[0.5rem] text-sm bg-gray-100 w-full">
          <span className="flex text-center self-center items-center justify-center mx-auto">
            {countdown}
          </span>
        </div>

        <div className="flex py-[0.5rem] text-sm bg-gray-100 w-full">
          <span
            onClick={viewChat}
            className={`${
              sideView === "chat" ? "text-main-color" : ""
            } basis-1/3 text-center border-r border-gray-400`}
          >
            실시간 채팅
          </span>
          <span
            onClick={viewParticipate}
            className={`${
              sideView === "participate" ? "text-main-color" : ""
            } basis-1/3 text-center border-r border-gray-400`}
          >
            참가자
          </span>
          <span
            onClick={viewBid}
            className={`${
              sideView === "bid" ? "text-main-color" : ""
            } basis-1/3 text-center`}
          >
            입찰
          </span>
        </div>
        {sideView === "chat" ? (
          <div className="min-h-screen w-full">
            <div className="flex items-start flex-col">
              <div className="flex-1 h-96 w-full border-gray-100 border-r-[1px]">
                <div className="flex-1 min-h-[72vh] max-h-[72vh] overflow-auto bg-white pb-1">
                  {chattingData.map((chatData, i) => (
                    <ChatItem
                      chatData={chatData}
                      userIdx={userIdx}
                      userInfoData={userInfoData[chatData.userIdx]}
                      key={i}
                    />
                  ))}
                </div>
              </div>

              <div className="flex border-[#A7A7A7] text-sm w-full pl-[2px]">
                <input
                  className="w-full h-12 px-4 py-2 border border-gray-300 rounded"
                  onChange={onChangeKeyword}
                  value={textMsg}
                  placeholder="(100자 이하)"
                  disabled={isInputDisabled}
                />
                <button
                  className="w-[20%] h-12 bg-main-color text-white rounded transition duration-300 ml-1"
                  onClick={sendMsg}
                  disabled={isInputDisabled}
                >
                  채팅
                </button>
              </div>

              <div className="flex flex-col flex-1 space-y-2"></div>
            </div>
          </div>
        ) : (
          ""
        )}
        {sideView === "participate" ? (
          <div className="flex-1 min-h-[77.9vh] max-h-[77.9vh] w-full border-gray-100 border-r-[1px] border-b-[1px]">
            <div className="flex flex-col overflow-auto bg-white mt-2 pl-5">
              {Object.values(userInfoData).map((userList) => (
                <ChatUserList
                  key={userList.userIdx}
                  userList={userList}
                  ban={ban}
                  noChat={noChat}
                  unBan={fetchBanDelete}
                  unNoChat={noChatDelete}
                  userAuth={userAuth}
                  banList={banList}
                  noChatList={noChatList}
                />
              ))}
            </div>
          </div>
        ) : (
          ""
        )}
        {sideView === "bid" ? (
          <div className="min-h-screen w-full">
            <div className="flex items-start flex-col">
              <div className="flex-1 h-96 w-full border-gray-100 border-r-[1px]">
                <div className="flex-1 min-h-[62vh] max-h-[62vh] overflow-auto bg-white pb-1">
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
              <div className="flex flex-col min-h-[10vh] w-full max-h-[10vh] text-sm bg-gray-100 pb-1 justify-center">
                <div className="flex flex-row w-full my-[5px]">
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
                  <p className="text-[17px]">현재 입찰 : </p>
                  <p className="text-[17px] px-1 text-main-color font-semibold">
                    {nowBid}
                  </p>
                  <p className="text-[17px]"> 원</p>
                </div>
              </div>
              <div className="flex border-[#A7A7A7] text-sm w-full pl-[2px]">
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
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
