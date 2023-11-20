"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { GetAuctionPostsView } from "@/service/my/auction";

import { IMessage, connectMessage, userInfo } from "@/service/chat/chat";

import { bannedUserState, noChatUserState } from "@/recoil/chatting";
import axios from "axios";
import { useRecoilState } from "recoil";

interface UserInfoData {
  [userIdx: number]: {
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
export default function HostStreamingInfoView() {
  const router = useRouter();
  const params = useParams();
  const idx = params?.idx;
  const pathName = usePathname() || "";

  const [postsData, setPostsData] = useState<GetAuctionPostsView>();
  const [endTime, setEndTime] = useState("");

  const socketRef = useRef<Socket | null>(null);
  let liveRoomIdx = useRef<string>();
  const [roomEnter, setroomEnter] = useState<boolean>(false);
  const [textMsg, settextMsg] = useState("");
  const [roomName, setroomName] = useState("");
  const [chattingData, setchattingData] = useState<IMessage[]>([]);
  const [banList, setBanList] = useState<banUserInfo[]>([]); // 밴 목록
  const [noChatList, setNoChatList] = useState<banUserInfo[]>([]); // 채금 목록
  const [bannedUserList, setbannedUserList] = useRecoilState(bannedUserState);
  const [noChatUserList, setnoChatUserList] = useRecoilState(noChatUserState);

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
  const [userAuth, setUserAuth] = useState("host"); //유저 권한
  const [noChatState, setNoChatState] = useState<boolean>(false); //유저 권한

  const [accessToken, setAccessToken] = useState("");

  const [userInfoData, setUserInfoData] = useState<userInfo[]>([]); //유저 정보 가지고 있는 리스트

  const [userIdx, setUserIdx] = useState(0); // 로그인 한 유저의 userIdx 저장
  const [nickname, setNickname] = useState(""); // 유저의 nickname 저장
  const [profilePath, setProfilePath] = useState(""); // 유저의 profilePath 저장

  const [sideView, setSideView] = useState("chat");
  const [participateView, setParticipateView] = useState("ban");

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
        const match = pathName.match(/\/streamhost\/(\d+)/);
        const extractedNumber = match ? match[1] : "";
        // 참가한 스트리밍의 방 번호(boardidx)로 채팅 입장
        setroomName(extractedNumber);
        setBoardIdx(parseInt(extractedNumber));
        const extractedAccessToken = userData.USER_DATA.accessToken;
        setAccessToken(extractedAccessToken);

        preset().then(() => {
          getData().then(() => {});
        });
      } else {
        router.replace("/");
        alert("로그인이 필요한 기능입니다.");
      }
    }
  }, []);

  const preset = useCallback(async () => {
    const storedData = localStorage.getItem("recoil-persist");
    if (storedData) {
      const userData = JSON.parse(storedData);
      if (userData.USER_DATA.accessToken) {
        setUserIdx(userData.USER_DATA.idx);
        setNickname(userData.USER_DATA.nickname);
        setProfilePath(userData.USER_DATA.profilePath);
      } else {
      }
    }
  }, []);

  useEffect(() => {
    joinRoom();
  }, [profilePath]);

  useEffect(() => {
    const chatContainer = bidContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chattingBidData]);

  useEffect(() => {
    if (userIdx === host) {
      setUserAuth("host");
      // console.log("당신은 이 방송의 host입니다.");
    }
  }, [userIdx, host]);

  const getData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/board/${idx}?macAdress=`
      );
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
      updateCountdown();
      const countdownInterval = setInterval(updateCountdown, 1000);
      if (parseInt(response.data.result.UserInfo.idx) === userIdx) {
        setUserAuth("host");
        // console.log("당신은 이 방송의 host입니다.======================");
      }
      return () => {
        clearInterval(countdownInterval);
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

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
        socketRef.current.emit("join-live", message);
      }
      setroomEnter(true);
    });
    // 메시지 리스너
    socket.on("live_message", (message: IMessage) => {
      setchattingData((chattingData) => [...chattingData, message]);
    });
    //다른 참여자가 방을 나갔을 때
    socket.on("leave-user", (message: IMessage) => {
      setUserList((prevUserList) => {
        const newData: { [key: number]: any } = { ...prevUserList };
        delete newData[message.userIdx];
        return newData;
      });
      setUserInfoData((prevUserInfoData) => {
        const newData = { ...prevUserInfoData };
        delete newData[message.userIdx];
        return newData;
      });
    });
    //참여자 정보를 추가하는 리스너
    socket.on("live_participate", (message: any) => {
      if (Array.isArray(message)) {
        const parsedDataArray = message.map((data) => JSON.parse(data));
        // console.log("===========live_participate : =======");
        // console.log(parsedDataArray);
        // console.log(message);
        // console.log("====================================");
        setUserList({});
        setUserInfoData([]);
        console.log(userInfoData);
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
    // console.log(socket.connected);
    // socket disconnect on component unmount if exist
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
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
    // console.log("userList : ", userList);
    setUserInfoData(Object.values(userList));
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
        socketBidRef.current.emit("join-room", message);
      }
      setroomEnter(true);

      fetchBidData();
    });
    // 메시지 리스너
    socketBid.on("Auction_message", (message: IMessage) => {
      setchattingBidData((chattingData) => [...chattingData, message]);
      // console.log("======경매 입찰 채팅 수신=======");
      // console.log("bid message  :  ", message);
      // console.log("========================");
      if (bidContainerRef.current) {
        bidContainerRef.current.scrollTop =
          bidContainerRef.current.scrollHeight;
      }
      setNowBid(message.message);
    });
    socketBid.on("Auction_End", (message: string) => {
      // console.log("======경매 입찰 채팅 : 경매 종료=======");
      // console.log("Auction_End message  :  ", message);
      // console.log("============================");
    });
    socketBid.on("error", (message: string) => {
      // console.log("======경매 입찰 채팅 에러 수신=======");
      // console.log("error message", message);
      // console.log("==============================");
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

  return (
    <>
      <div className="flex-col w-full right-0 min-h-screen h-full flex bg-[#4E4E4E]">
        <div className="flex py-[0.5rem] text-sm bg-transparent w-full justify-center">
          <div className="basis-1/2 flex flex-col">
            <span className={`text-center bg-transparent text-[#C3C3C3]`}>
              {userInfoData.length}
            </span>
            <div className="flex-col py-[0.5rem] text-sm bg-transparent w-full"></div>
            <span
              className={`basis-1/2 text-center bg-transparent text-[#C3C3C3]`}
            >
              시청자
            </span>
          </div>
          <div className="basis-1/2 flex flex-col">
            <span className={`text-center bg-transparent text-[#C3C3C3]`}>
              {nowBid}
            </span>
            <div className="flex-col py-[0.5rem] text-sm bg-transparent w-full"></div>
            <span className={`text-center bg-transparent text-[#C3C3C3]`}>
              경매 금액
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
