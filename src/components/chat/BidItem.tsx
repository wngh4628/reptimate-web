'use client'
import React, {useState,forwardRef,useImperativeHandle, useEffect} from 'react';
import { IMessage, connectMessage, Ban_Message, userInfo } from "@/service/chat/chat"


type Props = { userIdx: number, chatData: IMessage, userInfoData: userInfo};
const BidItem = forwardRef((props :{
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


    return (
		<div>
			{props.chatData.userIdx !=  props.userIdx ? 
				<div id="outer" style={{display:"flex",maxWidth:"280px",marginTop:"12px",paddingLeft:"10px"}}>
					<div>
						<div className=' px-[10px] py-[5px]' style={{borderRadius:"20px",maxWidth:"220px", backgroundColor:"#e4e6eb",marginLeft:"5px"}}> 
							<div style={{fontSize:"15px",wordBreak:"break-all"}}>{parseInt(props.chatData.message).toLocaleString()}</div>
						</div>
					</div>
					
				</div>
				:
				<div id="outer" className='pr-[5px]' style={{maxWidth:"250px",marginTop:"12px", marginLeft:"auto",display: "flex",justifyContent: "flex-end"}}>
					<div style={{display:"flex",marginLeft:"auto"}}>
						<div className=' px-[10px] py-[5px]' style={{marginLeft:"auto",borderRadius:"20px",backgroundColor:"#7A75F7"}}> 
							<div style={{fontSize:"15px", wordBreak:"break-all", color:'white',textAlign:"left"}}>{parseInt(props.chatData.message).toLocaleString()}</div>
						</div>
					</div>
					
				</div>
			}
		</div>
    );
});
BidItem.displayName = 'BidItem';
export default BidItem;