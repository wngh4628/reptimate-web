'use client'
import React, {useState,forwardRef,useImperativeHandle, useEffect} from 'react';
import { IMessage, connectMessage, Ban_Message, userInfo } from "@/service/chat/chat"


type Props = { userIdx: number, chatData: IMessage, userInfoData: userInfo};
const ChatItem = forwardRef((props :{
	userIdx: any,
	chatData: {
		userIdx: number,
		message: string
	},
	userInfoData: {
		userIdx: number,
        nickname: string,
		profilePath: string,
	}
}, ref) =>{
	useImperativeHandle(ref, () => ({
		
	}));

	const profilePath = props.userInfoData?.profilePath || '/img/reptimate_logo.png';
	
    return (
		<div>
			{props.chatData.userIdx !=  props.userIdx ? 
				<div id="outer" style={{display:"flex",maxWidth:"280px",marginTop:"12px",paddingLeft:"10px"}}>
					<img className="pt-[5px]" 
					src={profilePath} style={{borderRadius: "80px", objectFit: "cover", cursor:"Pointer", width:"30px", height:"30px"}}/>
					<div>
						<p className='text-[12px] ml-1'>{props.userInfoData.nickname}</p>
						<div className=' px-[10px] py-[5px]' style={{borderRadius:"20px",maxWidth:"220px", backgroundColor:"#e4e6eb",marginLeft:"5px"}}> 
							<div style={{fontSize:"15px",wordBreak:"break-all"}}>{props.chatData.message}</div>
						</div>
					</div>
					
				</div>
				:
				<div id="outer" className='pr-[5px]' style={{maxWidth:"250px",marginTop:"12px", marginLeft:"auto",display: "flex",justifyContent: "flex-end"}}>
					<div style={{display:"flex",marginLeft:"auto"}}>
						<div className=' px-[10px] py-[5px]' style={{marginLeft:"auto",borderRadius:"20px",backgroundColor:"#7A75F7"}}> 
							<div style={{fontSize:"15px", wordBreak:"break-all", color:'white',textAlign:"left"}}>{props.chatData.message}</div>
						</div>
					</div>
				</div>
			}
		</div>
    );
});
ChatItem.displayName = 'ChatItem';
export default ChatItem;