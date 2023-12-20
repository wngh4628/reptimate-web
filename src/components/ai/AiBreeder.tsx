"use client";
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
  const inputRef_PC = useRef<HTMLInputElement>(null);
  const inputRef_Mobile = useRef<HTMLInputElement>(null);  
  const btnRef = useRef<HTMLButtonElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recommendKeywordContainerRef = useRef<HTMLDivElement>(null);
  

  // 입장하자마자 챗봇이 인사
  useEffect(() => {    
    
    // const helloChat = {
    //   message: '안녕하세요 AI 사육사 입니다. 크레스티드 개코에 대해 무엇이든 물어보세요!',
    //   isUser: false
    // }
    // setchattingData([helloChat])

    handleSend('안녕?');

    
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
      
      if (btnRef.current) {
        btnRef.current.classList.remove('bg-main-color');
        btnRef.current.classList.add('bg-gray-400');
        btnRef.current.style.cursor = 'not-allowed'; // 커서를 변경하여 비활성화된 상태를 강조
      }
      
    } else{

      if (btnRef.current) {
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
      if(inputRef_PC.current){
        inputRef_PC.current.disabled = true;
      }
      if(inputRef_Mobile.current){
        inputRef_Mobile.current.disabled = true;
      }
      if (btnRef.current && recommendKeywordContainerRef.current) {
        
        btnRef.current.classList.remove('bg-main-color');
        btnRef.current.classList.add('bg-gray-400');
        btnRef.current.style.cursor = 'not-allowed'; // 커서를 변경하여 비활성화된 상태를 강조

        recommendKeywordContainerRef.current.classList.add('hidden');

      }

      const requestChat = {
        message: inputText,
        isUser: true
      }

      let ChattingData_requestChatAdded:getMessage[] = [];

      // 입장하자마자 '안녕?'이라고 인사하는 채팅은 채팅목록에 추가되지 않도록 처리
      if(chattingData.length !== 0){
        ChattingData_requestChatAdded = [...chattingData, requestChat];  
        setchattingData(ChattingData_requestChatAdded)
      }
  
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

          let ChattingData_responseChatAdded: getMessage[]

          ChattingData_responseChatAdded = [...ChattingData_requestChatAdded, responseChat];
  
          setchattingData(ChattingData_responseChatAdded)
          setLoading(false);

          if(inputRef_PC.current){
            inputRef_PC.current.disabled = false;
            inputRef_PC.current.focus();
          }
          if(inputRef_Mobile.current){
            inputRef_Mobile.current.disabled = false;
          }
          if (recommendKeywordContainerRef.current && btnRef.current) {
            recommendKeywordContainerRef.current.classList.remove('hidden');
            btnRef.current.disabled = false;
          }
        })
          .catch((error)=>{console.log('요청실패')
          console.log(error)  
  
          const responseChat = {
            message: '서버에 문제가 생겼어요! 다시 시도하거나 관리자에게 문의해주세요!',
            isUser: false
          }
  
          const ChattingData_responseChatAdded = [...ChattingData_requestChatAdded, responseChat];
          setchattingData(ChattingData_responseChatAdded)
          setLoading(false);
          if(inputRef_PC.current){
            inputRef_PC.current.disabled = false; 
          }
          if(inputRef_Mobile.current){
            inputRef_Mobile.current.disabled = false; 
          }
          if (recommendKeywordContainerRef.current && btnRef.current) {
            recommendKeywordContainerRef.current.classList.remove('hidden');
            btnRef.current.disabled = false;
          }
  
      })
    }
    
  }

  return (

    <div>
      <PC>

      <div className="max-w-screen-md mx-auto  mt-[130px]">

        <h2 className="text-3xl font-bold pt-5">사육 챗봇</h2>

        {/* 채팅창 */}
        <div className="mt-5">

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
            <div 
              className="flex justify-center text-main-color text-base mb-3 hidden"
              ref={recommendKeywordContainerRef}>
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
                className="flex px-3">
                <input 
                  type="text"
                  className="border border-gray-300 rounded-2xl px-3 py-2.5 flex-auto"
                  value={inputValue}
                  onChange={handleInputChange}
                  ref={inputRef_PC}
                  placeholder="AI 사육사에게 질문해주세요."
                  disabled
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
      <div className="max-w-screen-md mx-auto mt-8 p-4">
        <h2 className="text-2xl font-bold">개인 사육사 챗봇</h2>

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
            <div 
              className="flex text-main-color text-base mb-3 hidden"
              style={{
                  overflowX: 'auto',
                  maxWidth: '100%',
                  scrollSnapType: 'x mandatory',
                }}
                ref={recommendKeywordContainerRef}
                >
                <div className="border border-main-color bord rounded-2xl py-2.5 px-6 hover:cursor-pointer mr-2" onClick={() => {handleSend('크레 수분')}} style={{ flex: '0 0 auto' }}>
                  크레 수분
                </div>
                <div className="border border-main-color bord rounded-2xl py-2.5 px-6 hover:cursor-pointer mr-2" onClick={() => {handleSend('크레 먹이')}} style={{ flex: '0 0 auto' }}>
                  크레 먹이
                </div>
                <div className="border border-main-color bord rounded-2xl py-2.5 px-6 hover:cursor-pointer mr-2" onClick={() => {handleSend('크레 온도')}} style={{ flex: '0 0 auto' }}>
                  크레 온도
                </div>
                <div className="border border-main-color bord rounded-2xl py-2.5 px-6 hover:cursor-pointer mr-2" onClick={() => {handleSend('크레 사육장')}} style={{ flex: '0 0 auto' }}>
                  크레 사육장
                </div>
            </div>
            
            {/* 질문 작성 */}
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // 폼의 기본 동작(새로고침) 방지
                }} 
                className="flex">
                <input 
                  type="text"
                  className="border border-gray-300 rounded-2xl px-3 py-2.5 flex-auto"
                  value={inputValue}
                  onChange={handleInputChange}
                  ref={inputRef_Mobile}
                  placeholder="AI 사육사에게 질문해주세요."
                  disabled
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
    </Mobile>
    </div>
  );
}
