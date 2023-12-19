'use client'
import React, {useState,forwardRef,useImperativeHandle, useEffect} from 'react';
import { IMessage, connectMessage, Ban_Message, userInfo } from "@/service/chat/chat"

interface other {
    nickname: string;
    profilePath: string;
}

const PersonalChatItem = forwardRef((props :{
	userIdx: any,
	chatData: {
		userIdx: number,
		message: string,
		action: string,
	},
	userInfoData: other,
}, ref) =>{
	useImperativeHandle(ref, () => ({
		
	}));
    return (
		<div>
			{props.chatData.userIdx !=  props.userIdx ? 
				<div id="outer" style={{display:"flex",maxWidth:"280px",marginTop:"12px",paddingLeft:"10px"}}>
					{props.userInfoData && props.userInfoData.profilePath ? (
					    <img
					      className="mt-[5px] rounded-[80px] w-[30px] h-[30px]"
					      src={props.userInfoData.profilePath}
					      style={{ objectFit: "cover" }} />
					) : <img
							className="mt-[5px] rounded-[80px] w-[30px] h-[30px]"
							src="/img/reptimate_logo.png"
							style={{ objectFit: "cover" }} />
					}
					<div>
						<p className='text-[12px] ml-1'>{props.userInfoData ? props.userInfoData.nickname : ''}</p>
						<div className=' px-[10px] py-[5px]' style={{borderRadius:"20px",maxWidth:"220px", backgroundColor:"#e4e6eb",marginLeft:"5px"}}> 
							<div style={{fontSize:"15px",wordBreak:"break-all"}}>{props.chatData.message}</div>
						</div>
					</div>
				</div>
				:
				<div id="outer" className='pr-[5px]' style={{maxWidth:"250px",marginTop:"12px", marginLeft:"auto",display: "flex",justifyContent: "flex-end"}}>
					<div className='flex ml-auto'>
						{/* <div className='text-[12px] self-baseline pt-[12px] mr-[4px]'>{props.chatData.action === "send" ? "1" : ""}</div> */}
						<div className=' px-[10px] py-[5px]' style={{marginLeft:"auto",borderRadius:"20px",backgroundColor:"#7A75F7"}}> 
							<div style={{fontSize:"15px", wordBreak:"break-all", color:'white',textAlign:"left"}}>{props.chatData.message}</div>
						</div>
					</div>
				</div>
			}
		</div>
    );
});
PersonalChatItem.displayName = 'ChatItem';
export default PersonalChatItem;