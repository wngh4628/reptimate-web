'use client'
import React, {useState,forwardRef,useImperativeHandle, useEffect} from 'react';
import { IMessage, connectMessage, Ban_Message, userInfo } from "@/service/chat/chat"


const AiChatItem = forwardRef((props :{
	chatData: {
		message: string;
		isUser: boolean;
	},
}, ref) =>{
	useImperativeHandle(ref, () => ({
		
	}));
    return (
		<div>
			{props.chatData.isUser ? 
				<div id="outer" className='pr-[5px] w-5/6' style={{marginTop:"12px", marginLeft:"auto",display: "flex",justifyContent: "flex-end"}}>
					<div className='flex ml-auto'>
						<div className=' px-[10px] py-[5px]' style={{marginLeft:"auto",borderRadius:"20px",backgroundColor:"#7A75F7"}}> 
							<div style={{fontSize:"15px", wordBreak:"break-all", color:'white',textAlign:"left"}}>{props.chatData.message}</div>
						</div>
					</div>
				</div>

				:

				<div id="outer" style={{display:"flex",marginTop:"12px",paddingLeft:"10px"}} className='w-5/6'>
							<img
								className="rounded-[80px] w-[30px] h-[30px] border border-gray-300"
								src="/img/reptimate_logo.png"
								style={{ objectFit: "cover" }} />

					<div>
						<div className=' px-[10px] py-[5px]' style={{borderRadius:"20px", backgroundColor:"#e4e6eb",marginLeft:"5px"}}> 
							<div style={{fontSize:"15px",wordBreak:"break-all"}}>{props.chatData.message}</div>
						</div>
					</div>
				</div>

			}
		</div>
    );
});
AiChatItem.displayName = 'ChatItem';
export default AiChatItem;