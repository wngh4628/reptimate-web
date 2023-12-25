"use client";

import { useReGenerateTokenMutation } from "@/api/accesstoken/regenerate";
import { Mobile, PC } from "@/components/ResponsiveLayout";
import { getValueAnalysisResultsList } from "@/service/my/valueanalysisresultslist";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ValueAnalysisResults(props:any) {

  const [data, setData] = useState<getValueAnalysisResultsList | null>(null);
  const [accessToken, setAccessToken] = useState("");
  const reGenerateTokenMutation = useReGenerateTokenMutation();
  const router = useRouter();

  const setValueAnalysisResult = props.setValueAnalysisResult;

  
  useEffect(() => {
    const storedData = localStorage.getItem("recoil-persist");
    if (storedData) {
      const userData = JSON.parse(storedData);
      if (userData.USER_DATA.accessToken) {
        const extractedAccessToken = userData.USER_DATA.accessToken;
        setAccessToken(extractedAccessToken)
        getItems(extractedAccessToken);
      } else {
        router.replace("/");
        Swal.fire({
          text: "로그인이 필요한 기능입니다.",
          confirmButtonText: "확인", // confirm 버튼 텍스트 지정
          confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
        });
      }
    }
  }, []);

  const getItems = useCallback(
    async (accessToken: any) => {

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/mypage/valueAnalysisResultsList`,
          config
        );
        setData(
          {
            result: [
                ...response.data.result
            ]
          } as getValueAnalysisResultsList
        );

      } catch (error: any) {
        // 에러가 발생하면 여기에서 처리할 수 있습니다.
        // console.error("Error fetching user data:", error.response.data);
        if (error.response.data.status == 401) {
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
                  onSuccess: (data) => {
                    // api call 재선언
                    getItems(data);
                    setAccessToken(data);
                  },
                  onError: () => {
                    router.replace("/");
                    //
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
        }
      }

    },
    []
  );

  async function getResultDetail(idx:number) {

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/mypage/valueAnalysisResultDetail`+idx,
        config
      );

      // 필드 이름 변경
      const transformedDetailData = {
        data:{
          idx: response.data.result.idx,
          user_idx: response.data.result.userIdx,
          pet_name: response.data.result.petName,
          morph: response.data.result.morph,
          gender: response.data.result.gender,
          head_score: response.data.result.headScore,
          dorsal_score: response.data.result.dorsalScore,
          tail_score: response.data.result.tailScore,
          left_score: response.data.result.leftScore,
          right_score: response.data.result.rightScore,
          total_score: response.data.result.totalScore,
          left_info: response.data.result.leftInfo,
          right_info: response.data.result.rightInfo,
          top_img: response.data.result.topImg,
          left_img: response.data.result.leftImg,
          right_img: response.data.result.rightImg
        }
      };

      setValueAnalysisResult(transformedDetailData)

    } catch (error: any) {

      // 에러가 발생하면 여기에서 처리할 수 있습니다.
      // console.error("Error fetching user data:", error.response.data);
      if (error.response.data.status == 401) {
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
                onSuccess: (data) => {
                  // api call 재선언
                  getItems(data);
                  setAccessToken(data);
                },
                onError: () => {
                  router.replace("/");
                  //
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
      }
    }

  }
  

  return (
    <>
      <PC>
        <section className="w-full">
        <div className="w-full flex justify-center">
          <div className="w-[96%]">

            <div className="flex border-[1px] border-gray-300 h-[60px] items-center">
                <p className="flex font-bold text-[20px] pl-[2%] w-full">
                  가치판단 결과
                </p>
            </div>

          <div className="grid grid-cols-4 mb-10">

          {data?.result.map((item) => (

              <div
                key={item.idx}
                className="flex-col border shadow-sm shadow-gray-400 rounded-lg py-3 px-6 mt-5 mr-5 hover:border-solid hover:cursor-pointer hover:border-1 hover:border-main-color"
                onClick={ () => {getResultDetail(item.idx)}}
                >
                <img
                  className="h-[120px] w-[120px] rounded-[50%] border-2 mx-auto"
                  src={item.topImg}
                />
                
                <div className="flex-col mt-2 text-center">

                  <div className="font-bold">
                    {item.petName}
                  </div>
                  
                  <div className="text-sm">
                    총점: {item.totalScore}점
                  </div>

                </div>

              </div>
            ))}        

          </div>

          </div>
        </div>
      </section>
      </PC>
      <Mobile>
        <section className="w-full">
          <div className="w-full flex justify-center">
            <div className="w-[96%]">

              <div className="flex border-[1px] border-gray-300 h-[60px] items-center">
                  <p className="flex font-bold text-[20px] pl-[2%] w-full">
                    가치판단 결과
                  </p>
              </div>

            <div className="grid grid-cols-2 mb-10">

            {data?.result.map((item) => (

                <div
                  key={item.idx}
                  className="flex-col border shadow-sm shadow-gray-400 rounded-lg py-3 px-6 mt-5 mr-5 hover:border-solid hover:cursor-pointer hover:border-1 hover:border-main-color"
                  onClick={ () => {getResultDetail(item.idx)}}
                  >
                  <img
                    className="h-[120px] w-[120px] rounded-[50%] border-2 mx-auto"
                    src={item.topImg}
                  />
                  
                  <div className="flex-col mt-2 text-center">

                    <div className="font-bold">
                      {item.petName}
                    </div>
                    
                    <div className="text-sm">
                      총점: {item.totalScore}점
                    </div>

                  </div>

                </div>
              ))}        

            </div>

            </div>
          </div>
        </section>
      </Mobile>
    </>
    
  );
}
