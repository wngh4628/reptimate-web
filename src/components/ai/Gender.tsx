"use client";
import AiMenu from "@/components/ai/AiMenu";
import MorphCard from "@/components/MorphCard";
import { Mobile, PC } from "@/components/ResponsiveLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";


export default function Gender(props:any) {    

  const [isLoading, setIsLoading] = useState(false);
  const [imgPerforation, setImgFilePerforation] = useState(null);

  const setGenderResult = props.setGenderResult;

  // 암수구분 실행버튼 클릭이벤트
  const handleUpload = async () => {
    if(imgPerforation){
      const formData = new FormData();
      formData.append('file', imgPerforation);
      setIsLoading(true);

      axios({
        method:'post',
        url:`${process.env.NEXT_PUBLIC_AI_URL}/image_ai/gender_discrimination`,
        data: formData,
        headers: { // 요청 헤더
          'Content-Type': 'multipart/form-data',
        },
          })
          .then((result)=>{console.log('요청성공')
          console.log(result)
          setIsLoading(false);

          result.data.originImg = imgPerforation;
          
          setGenderResult(result);
      
        })
          .catch((error)=>{console.log('요청실패')
          console.log(error)  
          setIsLoading(false);
          Swal.fire({
            text: "요청에 실패했습니다. 이미지를 변경하거나, 다시 시도해주세요.",
            confirmButtonText: "확인", // confirm 버튼 텍스트 지정
            confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
          });

      })
    }    
    else{
      Swal.fire({
        text: "천공 사진을 선택해야 해야합니다.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile:(selectedFile:File) => {}) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if(selectedFile){
      setFile(selectedFile);
    }

  };
  
  return (

    <div>
      <PC>
      {/* 모달창 */}
        {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main-color"></div>
        </div>
      )}

      {/* 모프 정보 */}
      <div className="max-w-screen-sm mx-auto mt-5  mt-[130px]" >

        <h2 className="text-3xl font-bold pt-5">암수 구분</h2>

        <div className="mt-10">

          <h3 className="text-2xl font-bold">천공 사진</h3>
          <p className="mt-3">도마뱀 천공 사진을 예제 사진과 같이 확대해서 올려주세요.</p>
          
          <div className="flex mt-5">

          <div
            className={`relative flex flex-col items-center w-[290px] h-[290px] shadow-md shadow-gray-400 rounded-lg bg-gray-100`}
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

              
            <div className="mx-auto">
              <MorphCard imgPath="/img/file_upload.png" type="perforation" handleFileChange={handleFileChange} setImgFile={setImgFilePerforation} imgFile={imgPerforation} />
            </div>

          </div>
        </div>
        
                
        <div className="mt-10 mb-10 flex justify-center">
          <button 
          className=" bg-main-color text-white font-bold py-2 px-4 rounded w-1/2"
          onClick={handleUpload}>
            실행
            </button>
        </div>
        

      </div>
    </PC>

    <Mobile>
      {/* 모달창 */}
        {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main-color"></div>
        </div>
      )}

      {/* 모프 정보 */}
      <div className="flex flex-col p-4 mt-8 ml-1">
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

              
            <div className="mx-auto">
              <MorphCard imgPath="/img/file_upload.png" type="perforation" handleFileChange={handleFileChange} setImgFile={setImgFilePerforation} imgFile={imgPerforation} />
            </div>

          </div>
          </div>
                  
          <div className="mt-8 mb-4 flex justify-center">
            <button 
            className=" bg-main-color text-white font-bold py-2 px-4 rounded w-1/2"
            onClick={handleUpload}>
              실행
              </button>
          </div>
        
      </div>
    </Mobile>
    </div>
  );
}
