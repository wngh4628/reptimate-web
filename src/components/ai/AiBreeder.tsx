"use client";
import AiMenu from "@/components/AiMenu";
import MorphCard from "@/components/MorphCard";
import { Mobile, PC } from "@/components/ResponsiveLayout";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import AiChatItem from "../chat/AiChatItem";

interface getMessage {
  message: string;
  isUser: boolean;
}

export default function AiBreeder(props:any) {    
  const [inputValue, setInputValue] = useState('');
  const [chattingData, setchattingData] = useState<getMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  

  // 입장하자마자 챗봇이 인사
  useEffect(() => {    
    
    const helloChat = {
      message: '안녕하세요 AI 사육사 입니다. 크레스티드 개코에 대해 무엇이든 물어보세요!',
      isUser: false
    }
    setchattingData([helloChat])
    
  }, []);


  // 채팅이 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {

    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    }, [chattingData]);

  // 채팅을 입력할때마다 버튼 활성화 여부 결정
  useEffect(() => {

    if(inputValue.length === 0){
      
      if (inputRef.current && btnRef.current) {
        btnRef.current.classList.remove('bg-main-color');
        btnRef.current.classList.add('bg-gray-400');
        btnRef.current.style.cursor = 'not-allowed'; // 커서를 변경하여 비활성화된 상태를 강조
      }
      
    } else{

      if (inputRef.current && btnRef.current) {
          btnRef.current.classList.remove('bg-gray-400');
          btnRef.current.classList.add('bg-main-color');
          btnRef.current.style.cursor = 'pointer';
        }
    }

    }, [inputValue]);
  
    
  const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 챗봇 요청
  const handleSend = (inputText:string) => {
    
    if(inputText.length !==0){

      setLoading(true);
      setInputValue('');
      // 응답 올때까지 추가적인 질문 못하도록 막기
      if (inputRef.current && btnRef.current) {
        inputRef.current.disabled = true;

        btnRef.current.classList.remove('bg-main-color');
        btnRef.current.classList.add('bg-gray-400');
        btnRef.current.style.cursor = 'not-allowed'; // 커서를 변경하여 비활성화된 상태를 강조
      }

      const requestChat = {
        message: inputText,
        isUser: true
      }
  
      const ChattingData_requestChatAdded = [...chattingData, requestChat];
  
      setchattingData(ChattingData_requestChatAdded)
  
      axios({
        method:'post',
        url:`${process.env.NEXT_PUBLIC_AI_URL}/text_ai/chatting_bot`,
        params: {
            request_text: inputText,
        },
        headers: { // 요청 헤더
            "Content-Type": "application/json",
        },
          })
          .then((result)=>{console.log('요청성공')
          console.log(result)
  
  
          const responseChat = {
            message: result.data.document,
            isUser: false
          }
  
          const ChattingData_responseChatAdded = [...ChattingData_requestChatAdded, responseChat];
          setchattingData(ChattingData_responseChatAdded)
          setLoading(false);
          if (inputRef.current && btnRef.current) {
            inputRef.current.disabled = false;
            inputRef.current.focus()
          }
          
        })
          .catch((error)=>{console.log('요청실패')
          console.log(error)  
  
          const responseChat = {
            message: '질문을 잘 이해하지 못했어요.',
            isUser: false
          }
  
          const ChattingData_responseChatAdded = [...ChattingData_requestChatAdded, responseChat];
          setchattingData(ChattingData_responseChatAdded)
          setLoading(false);
          if (inputRef.current && btnRef.current) {
            inputRef.current.disabled = false;
            inputRef.current.focus()
          }
  
      })
    }
    
  }

  return (

    <div>
      <PC>

      <div className="max-w-screen-md mx-auto mt-5">

        <h2 className="text-3xl font-bold pt-5">개인 사육사 챗봇</h2>

        {/* 채팅창 */}
        <div className="mt-10">

          {/* 채팅 내용 */}
          <div
            className="border-t border-r border-l border-gray-300 h-96 p-3 overflow-y-auto"
            ref={chatContainerRef}
            >
            {chattingData.map((chatData, i) => (
                  <AiChatItem chatData={chatData} key={i} />
            ))}

            {loading && (
              <div className="w-[30px] h-[30px] border-t-4 border-main-color border-solid rounded-full animate-spin mx-auto mt-5"></div>
            )}
            

          </div>

          {/* 질문 */}
          <div className="border border-gray-300 h-1/2 p-3 ">
            {/* 추천 질문 */}
            <div className="flex justify-center text-main-color text-base">
              <div className="border border-main-color bord rounded-2xl py-2.5 px-12 hover:cursor-pointer mx-auto" onClick={() => {handleSend('크레 수분')}}>
                크레 수분
              </div>
              <div className="border border-main-color bord rounded-2xl py-2.5 px-12 hover:cursor-pointer mx-auto" onClick={() => {handleSend('크레 먹이')}}>
                크레 먹이
              </div>
              <div className="border border-main-color bord rounded-2xl py-2.5 px-12 hover:cursor-pointer mx-auto" onClick={() => {handleSend('크레 온도')}}>
                크레 온도
              </div>
              <div className="border border-main-color bord rounded-2xl py-2.5 px-12 hover:cursor-pointer mx-auto" onClick={() => {handleSend('크레 사육장')}}>
                크레 사육장
              </div>
            </div>
            
            {/* 질문 작성 */}
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // 폼의 기본 동작(새로고침) 방지
                }} 
                className="flex px-3 mt-3">
                <input 
                  type="text"
                  className="border border-gray-300 rounded-2xl px-3 py-2.5 flex-auto"
                  value={inputValue}
                  onChange={handleInputChange}
                  ref={inputRef}
                  placeholder="AI 사육사에게 질문해주세요."
                  />
                <button 
                  className="bg-gray-400 text-white font-bold py-2.5 px-4 rounded ml-3"
                  onClick={() => {handleSend(inputValue)}}
                  ref={btnRef}
                  style={{ cursor: 'not-allowed' }}
                  >
                  전송
                </button>
              </form>

            
          </div>
        </div>

      </div>
    </PC>

    <Mobile>

      {/* 모프 정보 */}
      <div className="flex flex-col p-4 mt-4 ml-1">
          <h2 className="text-2xl font-bold">암수 구분</h2>

          <div className="mt-8">

          <h3 className="text-xl font-bold">천공 사진</h3>
          <p className="mt-3">도마뱀 천공 사진을 예제 사진과 같이 확대해서 올려주세요.</p>

          <div className="flex mt-5">

          <div
            className={`relative flex flex-col items-center w-[165px] h-[165px] shadow-md shadow-gray-400 rounded-lg bg-gray-100`}
          >
            <img
              className={`max-w-full max-h-full object-cover w-full h-full shadow-md shadow-gray-400 rounded-lg`}
              src={'/img/perforation.jpeg'}
              style={{ zIndex: 1 }}
            />

            <p className="text-lg absolute bottom-0 mb-5 z-10">
              <strong>예제 사진</strong>
            </p>
          </div>

              

          </div>
          </div>

        
      </div>
    </Mobile>
    </div>
  );
}
