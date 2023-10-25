'use client'
import Image from 'next/image'
import React, { useState, useRef, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";

import StreamingChatView from "@/components/streamhost/livechat";

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


export default function Page() {
  const [sendMessage, setSendMessage] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [chat, setChat] = useState<IMessage[]>([]);
  const [textMsg, settextMsg] = useState('');
  const [roomName, setroomName] = useState('');
  const [userIdx, setUserIdx] = useState<string>(''); // 유저의 userIdx 저장

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // connect to socket server
    // const socket = io('http://localhost:3003/chat', {
    //   path: '/socket.io',
    // });

    // socketRef.current = socket;

    // // log socket connection
    // socket.on("connect", () => {
    //   console.log("SOCKET CONNECTED!", socket.id);
    //   setConnected(true);
    // });

    // // update chat on new message dispatched
    // socket.on("message", (message: IMessage) => {
    //   setChat(prevChat => [...prevChat, message]);
    // });
  
    // // socket disconnect on component unmount if exists
    // return () => {
    //   if (socketRef.current) {
    //     socketRef.current.disconnect();
    //     socketRef.current = null;
    //   }
    // };
  }, []);

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
          userIdx: parseInt(userIdx),
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
        userIdx: parseInt(userIdx, 10),
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
      <StreamingChatView></StreamingChatView>
    </div>
  );
}