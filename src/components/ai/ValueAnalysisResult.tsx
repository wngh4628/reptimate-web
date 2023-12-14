import CommunityMenu from "@/components/CommunityMenu";
import AdoptionPosts from "@/components/adoption/AdoptionPosts";
import MorphCard from "../MorphCard";
import ProgressBar from "./ProgressBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useReGenerateTokenMutation } from "@/api/accesstoken/regenerate";
import { useSetRecoilState } from "recoil";
import { userAtom, isLoggedInState } from "@/recoil/user";
import { usePathname, useRouter } from "next/navigation";
import { Mobile, PC } from "../ResponsiveLayout";
import Swal from "sweetalert2";

export default function ValueAnalysisResult(props:any) {
  const router = useRouter();
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [petName, setPetName] = useState("");
  const [userIdx, setUserIdx] = useState("")
  const reGenerateTokenMutation = useReGenerateTokenMutation();
  
  const valueAnalysisResultData =  props.valueAnalysisResult.data;

  const morph = valueAnalysisResultData.morph;
  const gender = valueAnalysisResultData.gender;

  const head_score = valueAnalysisResultData.head_score;
  const dorsal_score = valueAnalysisResultData.dorsal_score;
  const tail_score = valueAnalysisResultData.tail_score;
  const total_score = valueAnalysisResultData.total_score;

  const left_info = JSON.parse(valueAnalysisResultData.left_info);
  const left_score = left_info.score;
  const left_SecondPercent = left_info.SecondPercent;
  const left_ThirdPercent = left_info.ThirdPercent;
  const left_rgb = left_info.RGB;

  const right_info = JSON.parse(valueAnalysisResultData.right_info);
  const right_score = right_info.score;
  const right_SecondPercent = right_info.SecondPercent;
  const right_ThirdPercent = right_info.ThirdPercent;
  const right_rgb = right_info.RGB;

  const defult_rgb = [102, 153, 102];

  const idx = valueAnalysisResultData.idx;

  console.log(valueAnalysisResultData)

  useEffect(() => {
    const storedData = localStorage.getItem("recoil-persist");

    if (storedData) {
      const userData = JSON.parse(storedData);
      if (userData.USER_DATA && userData.USER_DATA.accessToken) {
        setAccessToken(userData.USER_DATA.accessToken)
        setUserIdx(userData.USER_DATA.idx);
      }
    }
  }, []);

  // 결과 저장 요청
  const handleSave = async () => {

    // 모프 이름 작성여부 확인
    if(petName.length === 0){
      Swal.fire({
        text: "개체의 이름을 작성해주세요",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
    } else{

      setShowModal(false);
      setIsLoading(true);  

      // 저장 요청
      const response = await axios({
        method:'post',
        url:`${process.env.NEXT_PUBLIC_AI_URL}/image_ai/analyzer_save`,
        params: {
          idx: idx,
          userIdx: userIdx,
          petName: petName
        },
        headers: { // 요청 헤더
          Authorization: `Bearer ${accessToken as string}`,
          'Content-Type': 'multipart/form-data',
        }})      

      // 로딩바 제거
      setIsLoading(false);  

      // 200 응답시 처리
      if(response.status === 200){
        console.log(`statusText: ${response.statusText}`)
        console.log(`response 객체: ${JSON.stringify(response)}`)
        Swal.fire({
          text: "저장이 완료되었습니다",
          confirmButtonText: "확인", // confirm 버튼 텍스트 지정
          confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
        });

      // 401(토큰만료) 응답시 처리
      } else if (response.status === 401){

        const storedData = localStorage.getItem("recoil-persist");
        if (storedData) {
          const userData = JSON.parse(storedData);
          if (userData.USER_DATA.accessToken) {
            const extractedARefreshToken = userData.USER_DATA.refreshToken;
            reGenerateTokenMutation.mutate(
              {
                refreshToken: extractedARefreshToken,
              },
              {
                onSuccess: (regeneratedAccessToken) => {
                  // api call 재선언
                  userData.USER_DATA.accessToken = regeneratedAccessToken;
                  setAccessToken(regeneratedAccessToken);
                  handleSave();
                },
                onError: () => {
                  router.replace("/");
                  setIsLoggedIn(false);
                  Swal.fire({
                    text: "로그인 만료\n다시 로그인 해주세요",
                    confirmButtonText: "확인", // confirm 버튼 텍스트 지정
                    confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
                  });
                },
              }
            );
          } else {
            router.replace("/");
            Swal.fire({
              text: "로그인이 필요한 기능입니다.",
              confirmButtonText: "확인", // confirm 버튼 텍스트 지정
              confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
            });
          }
        }
      // 201과 401이 아닌 모든 응답에 대한 처리
      } else {
        console.log(`statusText: ${response.statusText}`)
        console.log(`response 객체: ${JSON.stringify(response)}`)
        Swal.fire({
          text: "요청에 실패했습니다. 다시 시도해주세요.",
          confirmButtonText: "확인", // confirm 버튼 텍스트 지정
          confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
        });
      }
    }
  }


  return (
    
      <div>
      <PC>
        {/* 로딩바 */}
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main-color"></div>
          </div>
        )}

        {/* 모달창 */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75" onClick={() => setShowModal(false)}>
            <div className="bg-white p-8 rounded-md w-80" onClick={(e) => e.stopPropagation()}>
              <div className="relative flex justify-center items-center">
                <p><strong>개체의 이름을 작성해주세요</strong></p>
                <button className="absolute text-gray-700 right-0" onClick={() => setShowModal(false)}>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="flex flex-col justify-center">
              
              <input
                type="text"
                className="border p-2 mt-4"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button className="bg-gray-300 text-white font-bold py-2 px-4 rounded" onClick={() => {setShowModal(false)}}>
                취소
              </button>
              <button className="bg-main-color text-white font-bold py-2 px-4 rounded ml-1" onClick={() => {handleSave()}}>
                저장
              </button>
            </div>
          </div>
        </div>
        )}

          {/* 가치 판단 결과 */}
          <div className="max-w-screen-lg mx-auto mt-40">
          
          <h2 className="text-3xl font-bold">가치 판단 결과</h2>

          <div className="flex mb-24">
            {/* 이미지 */}
            <div className="flex-auto mt-4" style={{ flex: '1' }}>
              <div>
                <h3 className="text-2xl font-bold">{'윗면'}</h3>
                <div className="flex mt-5">
                  <MorphCard imgPath={valueAnalysisResultData.top_img} type="result"/>
                </div>
              </div>
                  
              <div className="mt-10">
                <h3 className="text-2xl font-bold">{'왼쪽 옆부분'}</h3>
                <div className="flex mt-5">
                  <MorphCard imgPath={valueAnalysisResultData.left_img} type="result"/>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-2xl font-bold">{'오른쪽 옆부분'}</h3>
                <div className="flex mt-5">
                  <MorphCard imgPath={valueAnalysisResultData.right_img} type="result"/>
                </div>
              </div>
            </div>
            
            {/* 결과 */}
            <div className="relative mt-5 " style={{ flex: '2' }}>
                <button
                className={`absolute right-0 bg-main-color text-white font-bold py-2 px-4 rounded ${accessToken.length === 0 ? 'hidden' : ''}`}
                onClick={() => setShowModal(true)}>
                  저장
                </button>

                <div className="flex flex-col items-center w-full shadow-md shadow-gray-400 rounded-lg bg-gray-100 mt-12 ">
                
                  <div className="w-full px-10 py-8">

                    <div className="relatvie flex">
                      <span className="absolute text-base font-medium dark:text-white">모프</span>
                      <span className="mx-auto">{morph}</span>
                    </div>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <div className="relatvie flex items-center">
                      <span className="absolute text-base font-medium dark:text-white">성별</span>
                      <span className="m-auto">{gender}</span>
                    </div>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'총점'} v={total_score} rgb={defult_rgb} unit={'점'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>
                    
                    <ProgressBar k={'머리'} v={head_score} rgb={defult_rgb} unit={'점'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'dorsal(등)'} v={dorsal_score} rgb={defult_rgb} unit={'점'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'꼬리'} v={tail_score} rgb={defult_rgb} unit={''}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'왼쪽 - 레터럴 (옆구리)'} v={left_score} rgb={defult_rgb} unit={'점'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'오른쪽 - 레터럴(옆구리)'} v={right_score} rgb={defult_rgb} unit={'점'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'왼쪽 - 1차 형질'} v={100} rgb={left_rgb[0]} unit={'%'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'왼쪽 - 2차 형질'} v={left_SecondPercent} rgb={left_rgb[1]} unit={'%'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'왼쪽 - 3차 형질'} v={left_ThirdPercent} rgb={left_rgb[2]} unit={'%'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'오른쪽 - 1차 형질'} v={100} rgb={right_rgb[0]} unit={'%'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'오른쪽 - 2차 형질'} v={right_SecondPercent} rgb={right_rgb[1]} unit={'%'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'오른쪽 - 3차 형질'} v={right_ThirdPercent} rgb={right_rgb[2]} unit={'%'}/>

                    </div>
                    

                </div>
            </div>
          </div>
        </div>
      </PC>

      <Mobile>
        {/* 로딩바 */}
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main-color"></div>
          </div>
        )}

        {/* 모달창 */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75" onClick={() => setShowModal(false)}>
            <div className="bg-white p-8 rounded-md w-80" onClick={(e) => e.stopPropagation()}>
              <div className="relative flex justify-center items-center">
                <p><strong>개체의 이름을 작성해주세요</strong></p>
                <button className="absolute text-gray-700 right-0" onClick={() => setShowModal(false)}>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="flex flex-col justify-center">
              
              <input
                type="text"
                className="border p-2 mt-4"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button className="bg-gray-300 text-white font-bold py-2 px-4 rounded" onClick={() => {setShowModal(false)}}>
                취소
              </button>
              <button className="bg-main-color text-white font-bold py-2 px-4 rounded ml-1" onClick={() => {handleSave()}}>
                저장
              </button>
            </div>
          </div>
        </div>
        )}

          {/* 가치 판단 결과 */}
          <div className="max-w-screen-lg mx-auto mt-10 p-4">
          
          <h2 className="text-2xl font-bold">가치 판단 결과</h2>
          <div
            style={{
              display: 'flex',
              overflowX: 'auto',
              maxWidth: '100%',
              scrollSnapType: 'x mandatory',
            }}
          >

            {/* 이미지 */}
            <div className="flex mt-8" style={{ flex: '1' }}>
              <div>
                <h3 className="text-xl font-bold">{'윗면'}</h3>
                <div className="flex mt-5">
                  <MorphCard imgPath={valueAnalysisResultData.top_img} type="result"/>
                </div>
              </div>
                  
              <div >
                <h3 className="text-xl font-bold">{'왼쪽 옆부분'}</h3>
                <div className="flex mt-5">
                  <MorphCard imgPath={valueAnalysisResultData.left_img} type="result"/>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold">{'오른쪽 옆부분'}</h3>
                <div className="flex mt-5">
                  <MorphCard imgPath={valueAnalysisResultData.right_img} type="result"/>
                </div>
              </div>
            </div>
            </div>
            
            {/* 결과 */}
            <div className="relative mt-5 " style={{ flex: '2' }}>
                <button
                className={`absolute right-0 bg-main-color text-white font-bold py-2 px-4 rounded ${accessToken.length === 0 ? 'hidden' : ''}`}
                onClick={() => setShowModal(true)}>
                  저장
                </button>

                <div className="flex flex-col items-center w-full shadow-md shadow-gray-400 rounded-lg bg-gray-100 mt-12 ">
                
                  <div className="w-full px-10 py-8">

                    <div className="relatvie flex">
                      <span className="absolute text-base font-medium dark:text-white">모프</span>
                      <span className="mx-auto">{morph}</span>
                    </div>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <div className="relatvie flex items-center">
                      <span className="absolute text-base font-medium dark:text-white">성별</span>
                      <span className="m-auto">{gender}</span>
                    </div>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'총점'} v={total_score} rgb={defult_rgb} unit={'점'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>
                    
                    <ProgressBar k={'머리'} v={head_score} rgb={defult_rgb} unit={'점'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'dorsal(등)'} v={dorsal_score} rgb={defult_rgb} unit={'점'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'꼬리'} v={tail_score} rgb={defult_rgb} unit={''}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'왼쪽 - 레터럴 (옆구리)'} v={left_score} rgb={defult_rgb} unit={'점'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'오른쪽 - 레터럴(옆구리)'} v={right_score} rgb={defult_rgb} unit={'점'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'왼쪽 - 1차 형질'} v={100} rgb={left_rgb[0]} unit={'%'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'왼쪽 - 2차 형질'} v={left_SecondPercent} rgb={left_rgb[1]} unit={'%'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'왼쪽 - 3차 형질'} v={left_ThirdPercent} rgb={left_rgb[2]} unit={'%'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'오른쪽 - 1차 형질'} v={100} rgb={right_rgb[0]} unit={'%'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'오른쪽 - 2차 형질'} v={right_SecondPercent} rgb={right_rgb[1]} unit={'%'}/>

                    <div className="bg-gray-300 h-px mt-5 mb-5"></div>

                    <ProgressBar k={'오른쪽 - 3차 형질'} v={right_ThirdPercent} rgb={right_rgb[2]} unit={'%'}/>

                    </div>
                    

                </div>
            </div>
          </div>

      </Mobile>
    </div>
  );
}
