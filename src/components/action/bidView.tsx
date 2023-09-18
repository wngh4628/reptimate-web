
"use client"
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useParams, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image'
import message_send from '../../../public/img/message_send3.png';
import axios from 'axios';
import { io, Socket } from "socket.io-client";
import { UserInfo } from "@/api/my/editUserInfo";


interface IMessage {
    userIdx: number;
    socketId: string;
    message: string;
    room: string;
}
interface DMessage {
    userIdx: number;
    score: number;
    room: string;
}

export default function BiddingView() {

    const [roomEnter, setroomEnter] = useState<boolean>(false);
    const [biddingState, setbiddingState] = useState<boolean>(false);
    const [textMsg, settextMsg] = useState('');
    const [roomName, setroomName] = useState('');
    const [userIdx, setUserIdx] = useState(0); // 유저의 userIdx 저장

    const socketRef = useRef<Socket | null>(null);
    let auctionRoomIdx = useRef<string>();
    const [userInfoData, setUserInfoData] = useState({});
    
    const [accessToken, setAccessToken] = useState("");
    const pathName = usePathname() || "";
    const router = useRouter();

    useEffect(() => {
      const storedData = localStorage.getItem('recoil-persist');
      if (storedData) {
          const userData = JSON.parse(storedData);
          if (userData.USER_DATA.accessToken) {
              const extractedAccessToken = userData.USER_DATA.accessToken;
              setAccessToken(extractedAccessToken);

              const extractedIdx = userData.USER_DATA.id;
              setUserIdx(extractedIdx);
              //mutation.mutate({ accessToken: extractedAccessToken });
              //getUserInfo(extractedAccessToken);
          } else {
              router.replace("/");
              alert("로그인이 필요한 기능입니다.");
          }
      }
    }, [accessToken])
    

    //입찰가 입력란
    const onChangeKeyword = (event: { target: { value: string; }; }) => {
        const numericInput = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        settextMsg(event.target.value);
    };
    // //참여 방 번호
    // const onChangeRoom = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    //   const { value } = e.target;
    //   setroomName(value);
    // }, []);
    //사용자 유저인덱스
    const onChangeUserIdx = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setUserIdx(parseInt(value));
    }, []);

    useEffect(() => {
        const match = pathName.match(/\/auction\/(\d+)\/live/);
        if(match) {
            const extractedNumber = match[1];
            setroomName(extractedNumber)
        }
    }, [])
    useEffect(() => {
      console.log(roomName);
      auctionRoomIdx.current = roomName;
    }, [roomName])
    useEffect(() => {
      if(userInfoData[userIdx]){
        setbiddingState(true);
      }
    }, [userInfoData])
    useEffect(() => {
        console.log(biddingState);
    }, [biddingState])

    //서버에 채팅 내역을 불러오는 요청 - 20개씩 불러온다.
    const fetchData = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_URL}/auctionChat/${auctionRoomIdx.current}?page=1&size=20&order=DESC`);
          const userInfoArray = response.data.result.userInfo;
          const resultData = response.data.result.list;
          const userInfoData = userInfoArray.map((user: string) => {
            const { userIdx, profilePath, nickname } = JSON.parse(user);
            return { [userIdx]: { userIdx, profilePath, nickname } };
          });
          const userDataObject = Object.assign({}, ...userInfoData);
          setUserInfoData(userDataObject);
          const messages: IMessage[] = resultData.map((item: any) => ({
            userIdx: item.userIdx,
            socketId: item.socketId,
            message: item.message,
            room: item.room,
          })).reverse();
          setchattingData(messages);
        } catch (error) {
          console.error('Error fetching data:', error);
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
          await axios.post(`${process.env.NEXT_PUBLIC_CHAT_URL}/AuctionChat/${roomName}`, {
            action: 'on',
            userIdx: userIdx,
          });
    
          //메시지 발송
          if(socketRef.current){
            const message = {
              userIdx: parseInt(userIdx),
              profilePath: 'test',
              nickname: 'nickname',
              room: roomName,
            };
            socketRef.current.emit("auction_participate", message);
            settextMsg("");
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };
    
    //메시지 발송하는 함수
    const sendMsg = async () => {
      if (textMsg.trim() !== "") {
        if(!biddingState){
          await fetchParticipate();
        }
        if(socketRef.current){
          const socketId = socketRef.current.id;
          const message: IMessage = {
            userIdx: parseInt(userIdx),
            socketId: socketId,
            message: textMsg.trim(),
            room: roomName,
          };
          socketRef.current.emit("Auction_message", message);
          settextMsg("");
        }
      }
    }
    const roomOut = () => {
      setroomEnter(false);
      setchattingData([]);
    }
    //방에 들어왔을 때 작동하는 함수
    const joinRoom = () => {
      const socket = io('${process.env.NEXT_PUBLIC_CHAT_URL}/AuctionChat', {
        path: '/socket.io',
      });
      // log socket connection
      socketRef.current = socket;
      socket.on("connect", () => {
        const message: IMessage = {
          userIdx: parseInt(userIdx, 10),
          socketId: socket.id,
          message: textMsg.trim(),
          room: roomName,
        };
        
        if(socketRef.current){
          socketRef.current.emit("join-room", message);
        }
        setroomEnter(true);
       
        fetchData();
      });
    
      // 메시지 리스너
      socket.on("Auction_message", (message: IMessage) => {
        setchattingData(chattingData => [...chattingData, message]);
        console.log('message', message);
      });
    
      socket.on("Auction_End", (message: string) => {
        console.log('Auction_End message', message);
        
      });
      //경매 입찰과 동시에 입찰자 명단 정보를 추가하는 리스너
      socket.on("auction_participate", (message: userInfo) => {
        setUserInfoData((prevUserInfoData) => ({
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
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }



    return (
        <>
            <div className='chat_box flex flex-col-reverse flex-1 bg-white'>
            </div>
            <div className='flex pt-[1rem] px-[4px] border-[#A7A7A7] text-sm'>
                <span className='flex w-full bg-[#4E4E4E] border border-[#4E4E4E] rounded-2xl h-[6rem]'>
                    <textarea className='flex-auto placeholder:italic placeholder:text-slate-400 block bg-[#4E4E4E] border border-[#4E4E4E] rounded-2xl pl-2 py-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 foweffwefcus:ring-1 sm:text-sm text-white resize-none' placeholder="메세지 보내기..." ></textarea>
                    <div className='rounded-full bg-white w-9 h-9 mx-2 mt-12'>
                        <Image
                            src={message_send}
                            width={25}
                            height={25}
                            alt="send message"
                            className='m-auto py-[9px]'
                        />

                    </div>
                </span>
            </div>
        </>
    )
}