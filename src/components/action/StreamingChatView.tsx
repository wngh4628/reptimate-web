'use client'
import Image from 'next/image'
import React, { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

import ChatItem from '../chat/ChatItem';
import ChatUserList from '../chat/ChatUserList';
import BanUserList from '../chat/BanUserList';
import {IMessage,connectMessage,Ban_Message,userInfo } from "@/service/chat/chat"
import axios from 'axios';
import Swal from 'sweetalert2';


interface UserInfoData {
  [userIdx: number]: {
    userIdx: number;
    nickname: string;
    profilePath: string;
  };
}
export default function StreamingChatView() {

  const router = useRouter();
  const pathName = usePathname() || "";

  const [roomEnter, setroomEnter] = useState<boolean>(false);
  const [textMsg, settextMsg] = useState('');
  const [roomName, setroomName] = useState('');
  const [chattingData, setchattingData] = useState<IMessage[]>([]);
  const [banList, setBanList] = useState<userInfo[]>([]);
  const [noChatList, setNoChatList] = useState<userInfo[]>([]);
  const socketRef = useRef<Socket | null>(null);
  let liveRoomIdx = useRef<string>();


  const [bidMsg, setBidMsg] = useState('');
  const [chattingBidData, setchattingBidData] = useState<IMessage[]>([]);
  let auctionRoomIdx = useRef<string>();
  const socketBidRef = useRef<Socket | null>(null);
  const [biddingState, setbiddingState] = useState<boolean>(false);
  const [userInfoBidData, setUserInfoBidData] = useState<userInfo[]>([]);//유저 정보 가지고 있는 리스트


  const [userList, setUserList] = useState<UserInfoData>({}); //현재 참여자 목록
  const [host, setHost] = useState(0);//방장 유무: 현재 하드코딩 -> 나중에 방 입장 시, props로 들고와야함
  const [boardIdx, setBoardIdx] = useState(0);//게시글 번호: 현재 하드코딩 -> 나중에 방 입장 시, props로 들고와야함
  const [userAuth, setUserAuth] = useState('guest');//유저 권한
  const [noChatState, setNoChatState] = useState<boolean>(false);//유저 권한

  const [accessToken, setAccessToken] = useState("");

  const [userInfoData, setUserInfoData] = useState<userInfo[]>([]);//유저 정보 가지고 있는 리스트
  
  const [userIdx, setUserIdx] = useState<number>(0); // 유저의 userIdx 저장
  const [nickname, setNickname] = useState(""); // 유저의 userIdx 저장
  const [profilePath, setProfilePath] = useState(""); // 유저의 userIdx 저장

  const [sideView, setSideView] = useState('chat');

  useEffect(() => {
    const storedData = localStorage.getItem('recoil-persist');
    if (storedData) {
        const userData = JSON.parse(storedData);
        if (userData.USER_DATA.accessToken) {
          const match = pathName.match(/\/action\/(\d+)\/live/);
          const extractedNumber = match ? match[1] : "";
          // 참가한 스트리밍의 방 번호(boardidx)로 채팅 입장
          setroomName(extractedNumber);
          const extractedAccessToken = userData.USER_DATA.accessToken;
          setAccessToken(extractedAccessToken);
          //입장한 사용자의 idx지정
          setUserIdx(userData.USER_DATA.idx);
          // 입장한 사용자의 이름 지정
          setNickname(userData.USER_DATA.nickname);
          setProfilePath(userData.USER_DATA.profilePath);
        } else {
          router.replace("/");
          alert("로그인이 필요한 기능입니다.");
        }
    }
  }, [])
  useEffect(() => {
    joinRoom();
    joinBidRoom();
  }, [profilePath])

    //입찰가 입력란
    const onChangeBid = (event: { target: { value: string; }; }) => {
      const numericInput = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
      setBidMsg(event.target.value);
    };

  //방에 들어왔을 때 작동하는 함수
  const joinRoom = () => {
    const socket = io('https://socket.reptimate.store/LiveChat', {
      path: '/socket.io',
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
      if(socketRef.current){
        console.log("========================")
        console.log("채팅 입장")
        console.log("========================")
        socketRef.current.emit("join-live", message);
      }
      setroomEnter(true);
    });
    // 메시지 리스너
    socket.on("live_message", (message: IMessage) => {
      console.log(message);
      
      setchattingData(chattingData => [...chattingData, message]);
    });
    //강퇴 처리
    socket.on("ban-user", (message: IMessage) => {
      if(message.userIdx === userIdx){
        roomOut();
        Swal.fire({
          text:'방송에서 추방 당했습니다.',
          icon: 'warning',
          confirmButtonText: '완료', // confirm 버튼 텍스트 지정
          confirmButtonColor: '#7A75F7', // confrim 버튼 색깔 지정
        });
      }else{
        setUserList(prevUserList => {
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
        text:'해당 방송 입장 금지를 당하셨습니다.',
        icon: 'error',
        confirmButtonText: '완료', // confirm 버튼 텍스트 지정
        confirmButtonColor: '#7A75F7', // confrim 버튼 색깔 지정
      });
    });
    //다른 참여자가 방을 나갔을 때
    socket.on("leave-user", (message: IMessage) => {
      console.log('message', message);
      
      setUserList(prevUserList => {
        const newData: { [key: number]: any } = { ...prevUserList };
        delete newData[message.userIdx];
        return newData;
      });
    });
    //채팅 금지 리스너
    socket.on("no_chat", (message: string) => {
      console.log("noChatIdx");
      Swal.fire({
        text:'채팅 금지를 받았습니다.',
        icon: 'warning',
        confirmButtonText: '완료', // confirm 버튼 텍스트 지정
        confirmButtonColor: '#7A75F7', // confrim 버튼 색깔 지정
      });
      setNoChatState(true);
    });
    //채팅 금지 해제 리스너
    socket.on("no_chat_delete", (message: IMessage) => {
      if(message.userIdx === userIdx){
        setNoChatState(false);
      }
    });
    //참여자 정보를 추가하는 리스너
    socket.on("live_participate", (message: string[]) => {
      if(userIdx === host){
        setUserAuth('host');
      }
      // for (const data of message) {
      //   const getUserInfo = JSON.parse(data);
      //   setUserInfoData((prevUserInfoData) => ({
      //     ...prevUserInfoData,
      //     [getUserInfo.userIdx]: {
      //       userIdx: getUserInfo.userIdx,
      //       profilePath: getUserInfo.profilePath,
      //       nickname: getUserInfo.nickname,
      //     },
      //   }));
      //   setUserList((prevsetUserList) => ({
      //     ...prevsetUserList,
      //     [getUserInfo.userIdx]: {
      //       userIdx: getUserInfo.userIdx,
      //       profilePath: getUserInfo.profilePath,
      //       nickname: getUserInfo.nickname,
      //     },
      //   }));
      // };

      // message가 배열이 아닌 경우, 배열로 변환
      const messageArray = Array.isArray(message) ? message : [message];
      messageArray.forEach((data) => {
        const getUserInfo = JSON.parse(data);
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
      });
    });
    console.log(socket.connected)
    // socket disconnect on component unmount if exists 
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }

  const onChangeKeyword = (e: { target: { value: string; }; }) => {
    const newValue = e.target.value;
    settextMsg(newValue);
  };
  
  const roomOut = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('leave-room', {
        userIdx: userIdx,
        roomIdx: roomName
      });
      socketRef.current.disconnect();
    }
    setroomEnter(false);
    setchattingData([]);
    setchattingBidData([]);
    setUserList({});
    setNoChatState(false);
    setUserAuth('guest');
  }, [socketRef, userIdx, roomName]);

  useEffect(() => {
    const handleBeforeUnload = (event: { preventDefault: () => void; returnValue: string; }) => {
      roomOut();
      event.preventDefault();
      event.returnValue = ''; // Some browsers require this property to be set.
    };
    // beforeunload 이벤트 리스너를 등록합니다.
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // 컴포넌트가 언마운트 될 때 이벤트 리스너를 제거합니다.
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [roomOut])

  useEffect(() => {
    console.log(roomName);
    liveRoomIdx.current = roomName;
    auctionRoomIdx.current = roomName;
  }, [roomName])
  useEffect(() => {
    if(userInfoBidData[userIdx]){
      setbiddingState(true);
    }
  }, [userInfoBidData])
    useEffect(() => {
    console.log('banList', banList);
  }, [banList])


    //강퇴 시키기
    const ban = (banUserIdx: number) => {
      if(userAuth === 'host'){
        if(socketRef.current){
          const message: Ban_Message = {
            userIdx: userIdx,
            banUserIdx: banUserIdx,
            room: roomName,
            boardIdx: boardIdx,
          };
          socketRef.current.emit("user_ban", message);
        }
      }
    }
    //채팅 금지 먹이기
    const noChat = (banUserIdx: number) => {
      console.log('noChat');
      if(userAuth === 'host'){
        console.log(socketRef.current);
        if(socketRef.current){
          console.log('noChat');
          const message: Ban_Message = {
            userIdx: userIdx,
            banUserIdx: banUserIdx,
            room: roomName,
            boardIdx: boardIdx,
          };
          socketRef.current.emit("noChat", message);
        }
      }
    }
    //채팅 금지 풀기
    const noChatDelete = (banUserIdx: number) => {
      if(userAuth === 'host'){
        console.log(socketRef.current);
        if(socketRef.current){
          console.log('noChat');
          const message: Ban_Message = {
            userIdx: userIdx,
            banUserIdx: banUserIdx,
            room: roomName,
            boardIdx: boardIdx,
          };
          socketRef.current.emit("noChatDelete", message);
        }
      }
    }
    //밴 목록 조회
    const fetchBanList = async () => {
      if(userAuth === 'host'){
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_URL}/LiveChat/ban/${roomName}/${boardIdx}/${userIdx}`);
          const userInfoArray = response.data.result;
          setBanList(userInfoArray);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }else {
        Swal.fire({
          text:'방장이 아닙니다.',
          icon: 'error',
          confirmButtonText: '완료', // confirm 버튼 텍스트 지정
          confirmButtonColor: '#7A75F7', // confrim 버튼 색깔 지정
        });
      }
    };
    //밴 풀기
    const fetchBanDelete = async (banUserIdx: number) => {
      if(userAuth === 'host'){
          await axios.post(`${process.env.NEXT_PUBLIC_CHAT_URL}/LiveChat/ban/${roomName}/${boardIdx}/${userIdx}/${banUserIdx}`);
      }else {
        Swal.fire({
          text:'방장이 아닙니다.',
          icon: 'error',
          confirmButtonText: '완료', // confirm 버튼 텍스트 지정
          confirmButtonColor: '#7A75F7', // confrim 버튼 색깔 지정
        });
      }
    };
    //채금 목록 조회
    const fetchNoChatList = async () => {
      if(userAuth === 'host'){
        console.log('no chat');
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_URL}/LiveChat/nochat/${roomName}/${boardIdx}/${userIdx}`);
          const userInfoArray = response.data.result;
          setNoChatList(userInfoArray);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }else {
        Swal.fire({
          text:'방장이 아닙니다.',
          icon: 'error',
          confirmButtonText: '완료', // confirm 버튼 텍스트 지정
          confirmButtonColor: '#7A75F7', // confrim 버튼 색깔 지정
        });
      }
    };
    //채금 풀기
    const fetchnoChatDelete = async (banUserIdx: number) => {
      if(userAuth === 'host'){
          await axios.post(`http://localhost:3003/LiveChat/noChat/${roomName}/${boardIdx}/${userIdx}/${banUserIdx}`);
      }else {
        Swal.fire({
          text:'방장이 아닙니다.',
          icon: 'error',
          confirmButtonText: '완료', // confirm 버튼 텍스트 지정
          confirmButtonColor: '#7A75F7', // confrim 버튼 색깔 지정
        });
      }
    };
  //메시지 발송하는 함수
  const sendMsg = async () => {
    if (textMsg.trim() === "") {
      return;
    }
    if(noChatState === true){
      Swal.fire({
        text:'채팅 금지 상태입니다.',
        icon: 'warning',
        confirmButtonText: '완료', // confirm 버튼 텍스트 지정
        confirmButtonColor: '#7A75F7', // confrim 버튼 색깔 지정
      });
      return;
    }
    if(socketRef.current){
      const socketId = socketRef.current.id;
      const message: IMessage = {
        userIdx: userIdx,
        socketId: socketId,
        message: textMsg.trim(),
        room: roomName,
      };
      console.log("========================")
        console.log("채팅 발송")
        console.log("========================")
      socketRef.current.emit("live_message", message);
      settextMsg("");
    }
  }

  // 경매 입찰 관련
  //방에 들어왔을 때 작동하는 함수
  const joinBidRoom = () => {
    const socketBid = io('https://socket.reptimate.store/AuctionChat', {
      path: '/socket.io',
    });
    // log socket connection
    socketBidRef.current = socketBid;
    socketBid.on("connect", () => {
      const message: IMessage = {
        userIdx: userIdx,
        socketId: socketBid.id,
        message: textMsg.trim(),
        room: roomName,
      };
      
      if(socketBidRef.current){
        socketBidRef.current.emit("join-room", message);
      }
      setroomEnter(true);
     
      fetchBidData();
    });
    // 메시지 리스너
    socketBid.on("Auction_message", (message: IMessage) => {
      setchattingBidData(chattingData => [...chattingData, message]);
      console.log('message', message);
    });
    socketBid.on("Auction_End", (message: string) => {
      console.log('Auction_End message', message);
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
  }
  //서버에 채팅 내역을 불러오는 요청 - 20개씩 불러온다.
  const fetchBidData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_URL}/auctionChat/${auctionRoomIdx.current}?page=1&size=20&order=DESC`);
      const userInfoArray = response.data.result.userInfo;
      const resultData = response.data.result.list;
      const userInfoData = userInfoArray.map((user: string) => {
        const { userIdx, profilePath, nickname } = JSON.parse(user);
        return { [userIdx]: { userIdx, profilePath, nickname } };
      });
      const userDataObject = Object.assign({}, ...userInfoData);
      setUserInfoBidData(userDataObject);
      const messages: IMessage[] = resultData.map((item: any) => ({
        userIdx: item.userIdx,
        socketId: item.socketId,
        message: item.message,
        room: item.room,
      })).reverse();
      setchattingBidData(messages);
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
      if(socketBidRef.current){
        const message = {
          userIdx: userIdx,
          profilePath: 'test',
          nickname: 'nickname',
          room: roomName,
        };
        socketBidRef.current.emit("auction_participate", message);
        settextMsg("");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  //메시지 발송하는 함수
  const sendBidMsg = async () => {
    if (textMsg.trim() !== "") {
      if(!biddingState){
        await fetchParticipate();
      }
      if(socketBidRef.current){
        const socketId = socketBidRef.current.id;
        const message: IMessage = {
          userIdx: userIdx,
          socketId: socketId,
          message: textMsg.trim(),
          room: roomName,
        };
        socketBidRef.current.emit("Auction_message", message);
        settextMsg("");
      }
    }
  }


  function viewChat() {
    if(sideView != "chat") {
        setSideView("chat")
    }
  }
  function viewParticipate() {
      if(sideView != "participate") {
          setSideView("participate")
      }
  }
  function viewBid() {
      if(sideView != "bid") {
          setSideView("bid")
      }
  }

  return (
    <>
      <div className="flex-col w-full right-0 h-[87%] flex bg-white">
        <div className='flex py-[0.5rem] text-sm bg-gray-100 w-full'>
            <span className='basis-1/2 text-[#CB3E3E] text-center'>최고가 : - - 원</span>
            <span className='basis-1/2 text-[#A447CF] text-center'>남은 시간 : - - : - -</span>
        </div>

        <div className='flex py-[0.5rem] text-sm bg-gray-100 w-full'>
          <span onClick={viewChat}
            className={`${
            sideView === "chat" ? "text-main-color" : ""
            } basis-1/3 text-center border-r border-gray-400`}>실시간 채팅</span>
          <span onClick={viewParticipate}
            className={`${
            sideView === "participate" ? "text-main-color" : ""
            } basis-1/3 text-center border-r border-gray-400`}>참가자</span>
          <span onClick={viewBid}
            className={`${
            sideView === "bid" ? "text-main-color" : ""
            } basis-1/3 text-center`}>입찰</span>
        </div>
        {sideView === "chat" ?
          <div className="min-h-screen w-full">
            <div className="flex items-start flex-col">
              <div className="flex-1 h-96 w-full border-gray-100 border-r-[1px]">
                <div className="flex-1 min-h-[72vh] max-h-[72vh] overflow-auto bg-white pb-1">
                  {chattingData.map((chatData, i) => (
                    <ChatItem chatData={chatData} userIdx={userIdx} userInfoData={userInfoData[chatData.userIdx]} key={i} />
                  ))}
                </div>
              </div>
              
              <div className='flex border-[#A7A7A7] text-sm w-full pl-[2px]'>
                <input
                  className="w-full h-12 px-4 py-2 border border-gray-300 rounded"
                  onChange={onChangeKeyword}
                  value={textMsg} 
                  placeholder="(100자 이하)"/>
                <button
                  className="w-[20%] h-12 bg-main-color text-white rounded transition duration-300 ml-1"
                  onClick={sendMsg}>
                    채팅
                </button>
              </div>
                    
              <div className="flex flex-col flex-1 space-y-2">
                  
              </div>  
            </div>
          </div>
            : ""
        }
        {sideView === "participate" ?
          <div className='flex-1 min-h-[77.9vh] max-h-[77.9vh] w-full border-gray-100 border-r-[1px] border-b-[1px]'>
            <div className="flex flex-col overflow-auto bg-white mt-2 pl-5">
              {Object.values(userList).map((userList) => (
                <ChatUserList key={userList.userIdx} userList={userList} ban = {ban} noChat = {noChat} userAuth = {userAuth}/>
              ))}
            </div>
          </div>
        : ""
        }
        {sideView === "bid" ?
            <div className='flex-1 min-h-[77.9vh] max-h-[77.9vh] w-full border-gray-100 border-r-[1px] border-b-[1px]'>
              <div>

              </div>
            </div>
            : ""
        }
        
    </div>
    
  </>
  )
}

