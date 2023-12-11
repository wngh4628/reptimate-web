"use client";
import AiMenu from "@/components/ai/AiMenu";
import MorphCard from "@/components/MorphCard";
import { Mobile, PC } from "@/components/ResponsiveLayout";
import { useEffect, useState } from "react";
import axios from "axios";


interface Option {
  value: string;
  label: string;
}

const morphOption: Option[] = [
    { value: "노멀", label: "노멀" },
    { value: "릴리 화이트", label: "릴리 화이트" },
    { value: "아잔틱", label: "아잔틱" },
    { value: "릴잔틱", label: "릴잔틱" },
    { value: "헷 아잔틱", label: "헷 아잔틱" },
    { value: "릴리 헷 아잔틱", label: "릴리 헷 아잔틱" },
    { value: "세이블", label: "세이블" },
    { value: "카푸치노", label: "카푸치노" },
    { value: "프라푸치노", label: "프라푸치노" },
    { value: "슈퍼 카푸", label: "슈퍼 카푸" },
    { value: "기타", label: "기타" },
];

const genderOption: Option[] = [
  { value: "미구분", label: "미구분" },
  { value: "암컷", label: "암컷" },
  { value: "수컷", label: "수컷" },
];


export default function MorphInfo(props:any) {    

  const [isLoading, setIsLoading] = useState(false);
  const [imgTop, setImgFileTop] = useState(null);
  const [imgLeft, setImgFileLeft] = useState(null);
  const [imgRight, setImgFileRight] = useState(null);
  const [morph, setMorph] = useState('');
  const [gender, setGender] = useState('');

  let setMorphInfo:(morphInfo:{})=>{};
  let setResult:(result:{})=>{};
  let analysisPurpose = props.analysisPurpose;
  let title = ''
  let endpoint = '';

  switch (analysisPurpose) {
    case 'valueAnalysis':
        title = '모프 가치 판단'   
        endpoint = 'value_analyzer'
        setResult = props.setValueAnalysisResult;
        break;
  
    case 'lineBreeding':
        title = '브리딩 추천 서비스'
        endpoint = 'linebreeding_recommend'
        setResult = props.setLineBreedingResult;
        setMorphInfo = props.setMorphInfo;
        break;
  }
  
  let userAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWR4Ijo2NSwiT1MiOiJ3ZWIiLCJpYXQiOjE3MDExNjM4MTksImV4cCI6MTcwMTE3MTAxOX0.eO81ICNUPiuXq7y6cxmVyDb0-9BUjW-kfdF6wKElJTM';

  useEffect(() => {
    
    const storedData = localStorage.getItem("recoil-persist");  
    if(storedData){
      const userData = JSON.parse(storedData || "");
      // const currentUserIdx = userData.USER_DATA.idx;
      
      userAccessToken = userData.USER_DATA.accessToken;
    }
}, []);
  

  // 가치판단 실행버튼 클릭이벤트
  const handleUpload = async () => {
    if(
      morph !== '' &&
      gender !== '' &&
      imgTop &&
      imgLeft &&
      imgRight
    ){
      const formData = new FormData();
      formData.append('files', imgTop);
      formData.append('files', imgLeft);
      formData.append('files', imgRight);
      setIsLoading(true);

      axios({
        method:'post',
        url:`${process.env.NEXT_PUBLIC_AI_URL}/image_ai/${endpoint}`,
        data: formData,
        params: {
          morph: morph,
          gender: gender,
        },
        headers: { // 요청 헤더
          'Content-Type': 'multipart/form-data',
        },
          })
          .then((result)=>{console.log('요청성공')
          console.log(result)
          setIsLoading(false);  
          setResult(result);
          if(analysisPurpose === 'lineBreeding'){
            setMorphInfo({
              morph,
              gender,
              formData
            })
          }
          
      
        })
          .catch((error)=>{console.log('요청실패')
          console.log(error)  
          setIsLoading(false);
          alert('요청에 실패했습니다. 이미지를 변경하거나, 다시 시도해주세요.')

      })
    }    
    else{
      alert('모프의 종류, 성별, 이미지를 모두 선택해야 합니다.');
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
      <div className="max-w-screen-sm mx-auto mt-[130px]">

        <h2 className="text-3xl font-bold pt-5">{title}</h2>

        <div className="flex mt-10 ">
          <div className="flex-auto">
            <h3 className="text-2xl font-bold">{'모프'}</h3>

            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  mt-3"
              value={morph}
              onChange={(e) => {setMorph(e.target.value)}}
            >

              <option value="" disabled hidden>모프를 선택해주세요.</option>
              
              
              {morphOption.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

          </div>

          <div className="flex-auto">
            <h3 className="text-2xl font-bold">{'성별'}</h3>

            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  mt-3"
              value={gender}
              onChange={(e) => {setGender(e.target.value)}}
            >

              <option value="" disabled hidden>성별을 선택해주세요.</option>

              {genderOption.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

          </div>
        </div>

        <div className="mt-10">

          

          <h3 className="text-2xl font-bold">{'윗면'}</h3>
          <p className="mt-3">머리를 왼쪽에 두고 위에서 촬영된 이미지를 선택해주세요.</p>
          
          <div className="flex mt-5">

            <div className="flex-auto">
              <MorphCard imgPath="/img/morph_top.png" type="example" />
            </div>
              
            <div className="flex-auto">
              <MorphCard imgPath="/img/file_upload.png" type="imgTop" handleFileChange={handleFileChange} setImgFile={setImgFileTop} imgFile={imgTop} />
            </div>

          </div>
        </div>


        <div className="mt-10">

          <h3 className="text-2xl font-bold">{'왼쪽 옆부분'}</h3>
          <p className="mt-3">머리를 왼쪽으로 두고 옆부분을 쵤영한 이미지를 선택해주세요.</p>

          <div className="flex mt-5">

            <div className="flex-auto">
              <MorphCard imgPath="/img/morph_left.png" type="example"/>
            </div>
              
            <div className="flex-auto">
              <MorphCard imgPath="/img/file_upload.png" type="imgLeft" handleFileChange={handleFileChange} setImgFile={setImgFileLeft} imgFile={imgLeft}/>
            </div>

          </div>
        </div>


        <div className="mt-10">

          <h3 className="text-2xl font-bold">{'오른쪽 옆부분'}</h3>
          <p className="mt-3">머리를 오른쪽으로 두고 옆부분을 쵤영한 이미지를 선택해주세요.</p>
          
          <div className="flex mt-5">

            <div className="flex-auto">
              <MorphCard imgPath="/img/morph_right.png" type="example"/>
            </div>
              
            <div className="flex-auto">
              <MorphCard imgPath="/img/file_upload.png" type="imgRight" handleFileChange={handleFileChange} setImgFile={setImgFileRight} imgFile={imgRight}/>
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
      <div className="flex flex-col p-4 mt-4 ml-1">
          <h2 className="text-2xl font-bold">{title}</h2>

          <div className="flex mt-8">
            <div className="flex-auto">
              <h3 className="text-xl font-bold">{'모프'}</h3>

              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mt-3"
                value={morph}
                onChange={(e) => {setMorph(e.target.value)}}
              >

                <option value="" disabled hidden>모프를 선택해주세요.</option>
                
                
                {morphOption.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

            </div>

            <div className="flex-auto">
              <h3 className="text-xl font-bold">{'성별'}</h3>

              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  mt-3"
                value={gender}
                onChange={(e) => {setGender(e.target.value)}}
              >

                <option value="" disabled hidden>성별을 선택해주세요.</option>

                {genderOption.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold">{'윗면'}</h3>
            <p className="mt-3">머리를 왼쪽에 두고 위에서 촬영된 이미지를 선택해주세요.</p>
            
            <div className="flex mt-2.5">

              <div className="flex-auto">
                <MorphCard imgPath="/img/morph_top.png" type="example" />
              </div>
                
              <div className="flex-auto">
                <MorphCard imgPath="/img/file_upload.png" type="imgTop" handleFileChange={handleFileChange} setImgFile={setImgFileTop} imgFile={imgTop} />
              </div>

            </div>
          </div>


          <div className="mt-8">

            <h3 className="text-xl font-bold">{'왼쪽 옆부분'}</h3>
            <p className="mt-3">머리를 왼쪽으로 두고 옆부분을 쵤영한 이미지를 선택해주세요.</p>

            <div className="flex mt-2.5">

              <div className="flex-auto">
                <MorphCard imgPath="/img/morph_left.png" type="example"/>
              </div>
                
              <div className="flex-auto">
                <MorphCard imgPath="/img/file_upload.png" type="imgLeft" handleFileChange={handleFileChange} setImgFile={setImgFileLeft} imgFile={imgLeft}/>
              </div>

            </div>
          </div>


          <div className="mt-8">

            <h3 className="text-xl font-bold">{'오른쪽 옆부분'}</h3>
            <p className="mt-3">머리를 오른쪽으로 두고 옆부분을 쵤영한 이미지를 선택해주세요.</p>
            
            <div className="flex mt-2.5">

              <div className="flex-auto">
                <MorphCard imgPath="/img/morph_right.png" type="example"/>
              </div>
                
              <div className="flex-auto">
                <MorphCard imgPath="/img/file_upload.png" type="imgRight" handleFileChange={handleFileChange} setImgFile={setImgFileRight} imgFile={imgRight}/>
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
