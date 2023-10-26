'use client'
import React, {useState,forwardRef,useRef, useEffect, useImperativeHandle} from 'react';
import Swal from 'sweetalert2';

import { userInfo } from "@/service/chat/chat";

const ChatUserList = forwardRef((props :{
	userList: {
		userIdx: number,
        nickname: string,
		profilePath: string,
	},
	ban: any,
	noChat : any,
	unBan: any,
	unNoChat : any,
	userAuth : string,
	banList : userInfo[],
	noChatList : userInfo[]
}, ref) =>{
	useImperativeHandle(ref, () => ({
		
	}));
	const [boxState, setBoxState] = useState(false);// 옵션 박스 상태
	const [SwalOn, setSwalOn] = useState(false); //알림 모달창 유무

	const [banned, setbanned] = useState(false); // 밴 여부
	const [noChatted, setNoChatted] = useState(false); // 채금 여부

	const wrapperRef = useRef<HTMLDivElement | null>(null);
	useEffect(()=>{
        document.addEventListener('mouseup', handleClickOutside);
        return()=>{
			if(boxState === true){
				document.removeEventListener('mouseup', handleClickOutside);
			}
        }
    })
	useEffect(() => {
		props.noChatList.map((user: userInfo) => {
			if (user.userIdx === props.userList.userIdx) {
				setNoChatted(true)
			}
		})
	  }, [noChatted]);
	useEffect(() => {
		props.banList.map((user: userInfo) => {
			if (user.userIdx === props.userList.userIdx) {
				setbanned(true)
			}
		})
	}, [banned]);
	const modalOnOff = (category: string) => {
		if(props.userAuth !== 'host'){
			Swal.fire({
				text:'방장이 아닙니다.',
				icon: 'error',
				confirmButtonText: '완료', // confirm 버튼 텍스트 지정
				confirmButtonColor: '#7A75F7', // confrim 버튼 색깔 지정
			  });
			return;
		}
		if(SwalOn === false){
			setSwalOn(true);
			let title = '';
			let text = '';
			if(category === 'ban'){
				title = `${props.userList.nickname}님을 강제 퇴장 시키겠습니까?`;
				text = '강퇴 후, 해당 라이브 방송은 재입장이 불가능합니다.';
			}else if(category === 'noChat'){
				title = `${props.userList.nickname}님을 채팅 금지 시키겠습니까?`;
				text = '채팅 금지 후, 해당 라이브 방송에서 채팅이 불가능합니다.';
			}else if(category === 'unBan'){
				title = `${props.userList.nickname}님의 강제 퇴장을 해제 하시겠습니까?`;
				text = '';
			}else if(category === 'unNoChat'){
				title = `${props.userList.nickname}님의 채팅 금지를 해제 시키겠습니까?`;
				text = '';
			}
			Swal.fire({
				title: title,
				text: text,
				icon: 'warning',
		
				showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
				confirmButtonColor: '#426BFA', // confrim 버튼 색깔 지정
				cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
				confirmButtonText: '적용', // confirm 버튼 텍스트 지정
				cancelButtonText: '취소', // cancel 버튼 텍스트 지정
				
			  }).then(result => {// 만약 Promise리턴을 받으면,
				if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
					if(category === 'ban'){
						props.ban(props.userList.userIdx);
					}else if(category === 'noChat'){
						props.noChat(props.userList.userIdx);
					}else if(category === 'unBan'){
						props.unBan(props.userList.userIdx);
					}else if(category === 'unNoChat'){
						props.unNoChat(props.userList.userIdx);
					}
					setBoxState(false);
				}
				setSwalOn(false);
			  });
		}
    }
	const optionBoxOnOff = () => {
		console.log("클릭한 사용자의 idx는 : "+ props.userList.userIdx);
		if(boxState === false && props.userAuth == 'host'){
			setBoxState(true);
		}
    }
	const handleClickOutside=(event: { target: any; })=>{
		if (boxState === true && wrapperRef.current &&  SwalOn === false && !wrapperRef.current.contains(event.target)) {
			setBoxState(false);
		}
	}

    return (
		<div className="flex ">
			<div className='flex' onClick={optionBoxOnOff} style={{cursor:"pointer"}}>{props.userList.nickname}</div>
			{boxState &&
				<div className='border-[5px] border-gray-300 bg-white' style={{position:"absolute",marginTop:"20px", backgroundColor:"#fffff", width:"100px", height:"105px"}} ref={wrapperRef}>
					<div className='flex items-center justify-center font-bold' onClick={() => modalOnOff('ban')}><h1>강퇴</h1></div>
					<div className='flex items-center justify-center font-bold' onClick={() => modalOnOff('noChat')}><h1>채금</h1></div>
					<div className='flex items-center justify-center font-bold' onClick={() => modalOnOff('unBan')}><h1>강퇴 해제</h1></div>
					<div className='flex items-center justify-center font-bold' onClick={() => modalOnOff('unNoChat')}><h1>채금 해제</h1></div>
				</div>
			}
        </div>
    );
});
ChatUserList.displayName = 'ChatUserList';
export default ChatUserList;