
"use client"
import { useEffect, useRef } from 'react';

type Props = {
    value: boolean,
    chettingOpen: Function;
}
export default function BottomPopup(props: Props) {
    // const menuRef = useRef(null);

    useEffect(() => {
        console.log(props.value);
    }, [props.value]);

    function chettingClose() {
        //false로 변경할 것.
        props.chettingOpen(false);
    }

    return (
        <>
            <div className={'container' + (props.value ? ' modal-open' : '')}>
                {/* <div className="container"> */}
                <div className="modal">
                    <div className="flex flex-col">
                        <div className='flex text-sm text-center flex-row-reverse'>
                            <a className="btn js-close-modal" onClick={chettingClose}>Close</a>
                        </div>
                        <div className='flex py-[0.5rem] text-sm bg-gray text-center'>
                            <span className='basis-1/2'>실시간 채팅</span>
                            <span className='basis-1/2'>경매가</span>
                        </div>

                    </div>
                    {/* <div className="header">채팅 
                    </div>
                    <div className="body"><p>And here is all its contents.</p>
                        <a className="btn js-close-modal" onClick={chettingClose}>Close</a>
                    </div> */}
                </div>
            </div>
        </>
    )
}