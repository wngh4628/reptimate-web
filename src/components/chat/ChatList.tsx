'use client'
import React, {useState,forwardRef,useImperativeHandle, useEffect} from 'react';
import { IMessage, connectMessage, chatRoom, userInfo } from "@/service/chat/chat"


// type Props = { userIdx: number, chatData: IMessage, userInfoData: userInfo};
type Props = { post: chatRoom};
const ChatList = forwardRef((props :{
    chatRoomData : {
        idx: number;
        state: string;
        chatRoomIdx: number;
        oppositeIdx: number;
        roomOut: string;
        chatRoom: {
            idx: number;
            createdAt: string;
            updatedAt: string;
            deletedAt: string;
            recentMessage: string;
        }
        UserInfo: {
            idx: number,
            nickname: string,
            profilePath: string
        }
    }
    ,
}, ref) =>{
	useImperativeHandle(ref, () => ({
	}));
    function formatDateToCustomString(dateString: string): string {
        const dateObject = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        };
        const formattedDate = new Intl.DateTimeFormat('ko-KR', options).format(dateObject);
        return formattedDate;
      }
    return (
		<div className='w-full flex flex-row justify-between cursor-pointer h-[75px] border-b-[1px]'>
            <div className='flex flex-row'>
                <img className="self-center rounded-3xl w-[60px] h-[60px] ml-[5px]" src={props.chatRoomData.UserInfo.profilePath} />
            	<div className='px-[10px] self-center'> 
                    <p className='text-[17px] font-bold'>{props.chatRoomData.UserInfo.nickname}</p>
            		<p className='text-[15px] break-words'>{props.chatRoomData.chatRoom.recentMessage}</p>
            	</div>
            </div>
            <div className='pt-[10px] pr-[10px]'>
                <p className='text-[13px]'>{formatDateToCustomString(props.chatRoomData.chatRoom.updatedAt)}</p>
            </div>
		</div>
    );
});
ChatList.displayName = 'ChatList';
export default ChatList;