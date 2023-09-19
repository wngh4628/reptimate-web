'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";

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

export default function SearchPage() {
  const [sendMessage, setSendMessage] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [chat, setChat] = useState<IMessage[]>([]);
  const [textMsg, settextMsg] = useState('');
  const [roomName, setroomName] = useState('');


  const [userIdx, setUserIdx] = useState<number>(0); // 유저의 userIdx 저장
  const [nickname, setNickname] = useState("");
  const [profilePath, setProfilePath] = useState(""); // 유저의 userIdx 저장
  const [accessToken, setAccessToken] = useState("");
  const router = useRouter();

  const socketRef = useRef<Socket | null>(null);

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
        } else {
          router.replace("/");
          alert("로그인이 필요한 기능입니다.");
        }
    }
  }, [])

  const onChangeKeyword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    settextMsg(value);
  }, []);

  const onChangeRoom = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setroomName(value);
  }, []);
  const onChangeUserIdx = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserIdx(value);
  }, []);

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
  const deleteMsg = () => {
      if(socketRef.current){
        const message: DMessage = {
          userIdx: 1,
          score: 1690283005342,
          room: '3',
        };
        socketRef.current.emit("removeMessage", message);
      }
  }
  const joinRoom = () => {
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
    socket.on("message", (message: IMessage) => {
      setChat(prevChat => [...prevChat, message]);
      console.log('message', message);
      
    });

    socket.on("removeMessage", (message: IMessage) => {
      setChat(prevChat => [...prevChat, message]);
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
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl text-gray-600 mb-4">Reptimate</h1>
        <div className="mb-4">
          <input
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={textMsg}
            onChange={onChangeKeyword}
            placeholder="메시지 입력..."
          />
        </div>
        <div className="mb-4">
          <input
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={roomName}
            onChange={onChangeRoom}
            placeholder="방 이름 입력..."
          />
        </div>
        <div className="mb-4">
          <input
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={userIdx}
            onChange={onChangeUserIdx}
            placeholder="상대 유저 ID 입력..."
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={sendMsg}
          >
            보내기
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={joinRoom}
          >
            방 참여
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={deleteMsg}
          >
            메시지 삭제
          </button>
        </div>
      </div>
    </div>
  );
}