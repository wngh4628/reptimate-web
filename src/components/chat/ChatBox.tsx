'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

import ChatList from "@/components/chat/ChatList"
import PersonalChatItem from '../chat/PersonalChatItem';

import {chatRoom,connectMessage,Ban_Message,userInfo, getResponseChatList } from "@/service/chat/chat"

import  { useReGenerateTokenMutation } from "@/api/accesstoken/regenerate"
import { userAtom, isLoggedInState } from "@/recoil/user";
import { chatRoomState, chatRoomVisisibleState, chatNowInfoState} from "@/recoil/chatting";
import { useRecoilState, useSetRecoilState } from "recoil";

interface IMessage {
  userIdx: number;
  socketId: string;
  message: string;
  room: number;
}
interface getMessage {
    userIdx: number;
    action: string;
    socketId: string;
    message: string;
    room: string;
    score: number;
}
interface DMessage {
  userIdx: number;
  score: number;
  room: number;
}
interface other {
    nickname: string;
    profilePath: string;
}
export default function PersonalChatBox() {
  const [sendMessage, setSendMessage] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [chat, setChat] = useState<IMessage[]>([]);
  const [textMsg, settextMsg] = useState('');
  const [roomName, setroomName] = useState<number>(0);
  const [data, setData] = useState<getResponseChatList | null>(null);
  const [chattingData, setchattingData] = useState<getMessage[]>([]);
  const [userInfoData, setUserInfoData] = useState<other>({nickname: "", profilePath: ""});//유저 정보 가지고 있는 리스트
  const [existNextPage, setENP] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const target = useRef(null);


  const [userIdx, setUserIdx] = useState<number>(0); // 유저의 userIdx 저장
  const [nickname, setNickname] = useState("");
  const [profilePath, setProfilePath] = useState(""); // 유저의 userIdx 저장
  const [accessToken, setAccessToken] = useState("");
  const router = useRouter();

  const [otherNickname, setotherNickname] = useState("");

  const socketRef = useRef<Socket | null>(null);

  const reGenerateTokenMutation = useReGenerateTokenMutation();
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  const setchatRoomState = useSetRecoilState(chatRoomState);
  const [chatRoomVisisible, setchatRoomVisisibleState] = useRecoilState(chatRoomVisisibleState);
  const [chatNowInfo, setchatNowInfo] = useRecoilState(chatNowInfoState);
  // const [chatRoom, setchatRoom] = useRecoilState(chatRoomState);

  const chatDivRef = useRef(null);

  const options = {
    threshold: 1.0,
  };

  useEffect(() => {
    const storedData = localStorage.getItem('recoil-persist');
    if (storedData) {
      const userData = JSON.parse(storedData);
      if (userData.USER_DATA.accessToken) {
        const extractedAccessToken = userData.USER_DATA.accessToken;
        setAccessToken(extractedAccessToken);
        //입장한 사용자의 idx지정
        setUserIdx(userData.USER_DATA.idx);
        // 입장한 사용자의 이름 지정
        setNickname(userData.USER_DATA.nickname);
        setProfilePath(userData.USER_DATA.profilePath);

        //상대 닉네임과 채팅방 번호를 지정
        setotherNickname(chatNowInfo.nickname);
        setroomName(chatNowInfo.roomName);

        getChatRoomHistory(extractedAccessToken, chatNowInfo.roomName);
      } else {
        router.replace("/");
        alert("로그인이 필요한 기능입니다.");
      }
    }
  }, [])

  useEffect(() => {
    setUserInfoData({nickname: chatNowInfo.nickname, profilePath: chatNowInfo.profilePath})
    joinRoom()

  }, [roomName])

  useEffect(() => {
    if (chatDivRef.current) {
        (chatDivRef.current as HTMLDivElement).scrollTop = (chatDivRef.current as HTMLDivElement).scrollHeight;
    }
  }, [chattingData]);

  const onChangeKeyword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    settextMsg(value);
  }, []);

  const getChatRoomNo = async (accessToken: string, userIdx: number, otherIdx: number) => {
    setLoading(true);
      const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
      };
      try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_URL}/chat/room/`+otherIdx, config);
          console.log(response);
      } catch (error: any) {
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
                              getChatRoomNo(data, userIdx, otherIdx);
                          },
                          onError: () => {
                              router.replace("/");
                              setIsLoggedIn(false)
                              // 
                              alert("로그인 만료\n다시 로그인 해주세요");
                          }
                      });
                  } else {
                      router.replace("/");
                      alert("로그인이 필요한 기능입니다.");
                  }
              }
          }
      }
  };
    const getChatRoomHistory = useCallback(async (accessToken: string, roomName: number) => {
    setLoading(true);
      const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
      };
      try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_URL}/chat/${roomName}?page=${page}&size=20&order=DESC`, config);
          console.log("==================getChatRoomHistory===================");
          const newChattingData = [...chattingData, ...response.data.result];
          const reversedData = newChattingData.reverse();
          setchattingData(reversedData);
          console.log(chattingData);

        //   setENP(response.data?.result.existsNextPage);
          setPage((prevPage) => prevPage + 1);
      } catch (error: any) {
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
                              getChatRoomHistory(data, roomName);
                          },
                          onError: () => {
                              router.replace("/");
                              // 
                              alert("로그인 만료\n다시 로그인 해주세요");
                          }
                      });
                  } else {
                      router.replace("/");
                      alert("로그인이 필요한 기능입니다.");
                  }
              }
          }
      }
    }, [page]);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !loading) {
                    getChatRoomHistory(accessToken, roomName);
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
    }, [getChatRoomHistory, loading, options]);
  // 채팅방 입장시 ui 채팅방으로 교체
  function intoChatting(clickedChatRoomData: chatRoom) {
    setchatRoomVisisibleState(true)
    console.log(clickedChatRoomData);
  }
  //채팅 발송
  const sendMsg = () => {
    if (textMsg.trim() !== "") {
      if(socketRef.current){
        const socketId = socketRef.current.id;
        const message: IMessage = {
          userIdx: userIdx,
          socketId: socketId,
          message: textMsg.trim(),
          room: roomName,
        };
        socketRef.current.emit("message", message);
        settextMsg("");
      }
    }
  }
  // const deleteMsg = () => {
  //     if(socketRef.current){
  //       const message: DMessage = {
  //         userIdx: 1,
  //         score: 1690283005342,
  //         room: 3,
  //       };
  //       socketRef.current.emit("removeMessage", message);
  //     }
  // }
  const joinRoom = () => {
    console.log("============================")
    console.log("입장한 방 번호 : " + roomName)
    console.log("상대방 닉네임 : " + otherNickname)
    console.log("============================")
    const socket = io('https://socket.reptimate.store/chat', {
      path: '/socket.io',
    });
    // log socket connection
    socketRef.current = socket;
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
      const message: IMessage = {
        userIdx: userIdx,
        socketId: socket.id,
        message: textMsg.trim(),
        room: roomName,
      };
      if(socketRef.current){
        socketRef.current.emit("join-room", message);
      }
      setConnected(true);

    });
    // update chat on new message dispatched
    socket.on("message", (message: getMessage) => {
        setchattingData(prevChat => [...prevChat, message]);
        console.log('message', message);
    });
    //읽음 처리 연락 받는 기능 만들어주세요.
    socket.on("afterRead", (message: getMessage) => {
        console.log('message', message);
    });
    socket.on("removeMessage", (message: getMessage) => {
        setchattingData(prevChat => [...prevChat, message]);
    });
    // socket disconnect on component unmount if exists 
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }
  function chatRoomOut() {
    setchatRoomVisisibleState(false)
    setchatNowInfo({nickname: "", roomName: 0, profilePath: ""});
  }

return (
    <div className="min-h-screen w-full">
        <div className="w-full h-[40px] border-gray-100 flex flex-row">
            <img className='ml-[5px] w-[20px] h-[20px] self-center cursor-pointer' src="/img/ic_back.png" onClick={chatRoomOut}/>
            <div className='text-[15px] self-center text-center flex-grow pr-[25px]'>{otherNickname}</div>
        </div>

        <div className="flex items-start flex-col">

          <div className="flex-1 w-full border-gray-100 border-r-[1px]">
            <div ref={chatDivRef}
            className="flex-1 h-[375px] overflow-auto bg-white pb-1">

              {
              chattingData.map((chatData, i) => (
                chatData.userIdx ? (
                    // chatData의 userIdx가 현재 사용자의 userIdx와 일치하는 경우
                    <PersonalChatItem chatData={chatData} userIdx={userIdx} userInfoData={userInfoData} key={i} />
                  ) : null // 일치하지 않는 경우, null을 반환하여 해당 아이템을 무시
              ))
              }
            </div>
          </div>
          
          <div className='flex border-[#A7A7A7] text-sm w-full pl-[2px]'>
            <input
              className="w-full h-12 px-4 py-2 border border-gray-300 rounded"
              onChange={onChangeKeyword}
              value={textMsg} />
            <button
              className="w-[20%] h-12 bg-main-color text-white rounded transition duration-300 ml-1"
              onClick={sendMsg}>
                전송
            </button>
          </div>
                
          <div className="flex flex-col flex-1 space-y-2">
              
          </div>  

        </div>
    </div>
  );
}