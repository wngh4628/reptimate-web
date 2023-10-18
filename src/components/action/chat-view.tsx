
"use client"
import { useEffect, useRef } from 'react';
import Image from 'next/image'
import message_send from '../../../public/img/message_send3.png';

type Props = {
    // src: string,
}
export default function ChatView(props: Props) {
    useEffect(() => {
    }, [])


    return (
        <>
            <div className='chat_box flex flex-col-reverse flex-1 bg-white'>
                <div className='flex text-right py-1'>
                    <div className='rounded-full bg-purple w-6 h-7'></div>
                    <div className='py-1 px-2'>김지훈 : 안녕하세요 ~~</div>
                </div>
                <div className='flex flex-row-reverse text-left py-1'>
                    <div className='rounded-full bg-purple w-6 h-6'></div>
                    <div className='py-1 px-2'>문준호 : 안녕하세요 !!</div>
                </div>
                <div className='flex flex-row-reverse text-left py-1'>
                    <div className='rounded-full bg-purple w-6 h-6'></div>
                    <div className='py-1 px-2'>김유수 : 안녕하세요 ###</div>
                </div>
                <div className='flex flex-row-reverse text-left py-1'>
                    <div className='rounded-full bg-purple w-6 h-6'></div>
                    <div className='py-1 px-2'>김기용 : 안녕하세요 $$$</div>
                </div>
                <div className='flex flex-row-reverse text-left py-1'>
                    <div className='rounded-full bg-purple w-6 h-6'></div>
                    <div className='py-1 px-2'>박용진 : 안녕하세요 %%%%</div>
                </div>

            </div>
            <div className='flex pt-[1rem] px-[1rem] border-[#A7A7A7] text-sm'>
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