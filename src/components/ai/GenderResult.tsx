// "use client";
import { useEffect, useState } from "react";
import MorphCard from "../MorphCard";
import { Mobile, PC } from "../ResponsiveLayout";

export default function GenderResult(props:any) {
    
    const [originImgPath, setOriginImgPath] = useState('');
    
    const genderResultData = props.genderResult.data;
    const setGenderResult = props.setGenderResult;

    const resultImgPath = genderResultData.returnImg;

    const originImg = genderResultData.originImg;

    const explanation = genderResultData.result;

    const maleText = "수컷";
    const femaleText = "암컷";
    let genderDetected = null;

    let sentences: string[] = [];
    
    if (explanation.includes(maleText)) {
        sentences = explanation.split(maleText);
        genderDetected = maleText;
    } else if(explanation.includes(femaleText)){
        sentences = explanation.split(femaleText);
        genderDetected = femaleText;
    }


    useEffect(() => {

        const reader = new FileReader();
        reader.onload = (event) => {
          if (event && event.target && event.target.result) {
            setOriginImgPath(event.target.result as string);
          }
        };

        reader.readAsDataURL(originImg);
    
      }, [originImgPath]);
    
    return(
        <div>
            <PC>
                <div>

                    <div className="max-w-screen-sm mx-auto mb-10">

                        <h2 className="text-3xl font-bold mt-10">암수 구분 결과</h2>

                        <div className="flex mt-10">
                            <div className={`flex flex-col justify-center items-center w-[290px] h-[290px] shadow-md shadow-gray-400 rounded-lg bg-gray-100`}>
                                <img
                                className={`max-w-full max-h-full object-cover w-full h-full shadow-md shadow-gray-400 rounded-lg`}
                                src={originImgPath}
                                style={{ zIndex: 1 }}
                                />
                            </div>

                            <div className="mx-auto">
                                <MorphCard imgPath={resultImgPath} type="result"/>
                            </div>
                                
                        </div>


                        <div className="mt-10 text-center mr-5">
                            <p className={`mt-2.5 text-xl font-bold`}>
                                {sentences[0]}
                                {' '}
                                <span className={genderDetected === maleText ? 'text-blue-500' : genderDetected === femaleText ? 'text-pink-500' : ''}>
                                    {genderDetected}
                                </span>
                                {sentences[1]}
                            </p>    
                        </div>
                        
                    </div>
                    <div className="mt-8 mb-4 flex justify-center">
                        <button 
                        className=" bg-main-color text-white font-bold py-2 px-4 rounded w-1/4"
                        onClick={()=>{setGenderResult(null)}}>
                            다시하기
                        </button>
                    </div>
                </div> 
            </PC>
            <Mobile>
                <div>

                    <div className="p-4">

                        <h2 className="text-2xl font-bold mt-4">암수 구분 결과</h2>

                        <div className="flex mt-10">
                            <div className={`flex flex-col justify-center items-center w-[165px] h-[165px] shadow-md shadow-gray-400 rounded-lg bg-gray-100`}>
                                <img
                                className={`max-w-full max-h-full object-cover w-full h-full shadow-md shadow-gray-400 rounded-lg`}
                                src={originImgPath}
                                style={{ zIndex: 1 }}
                                />
                            </div>
                            <div className="mx-auto">
                                <MorphCard imgPath={resultImgPath} type="result"/>
                            </div>
                                
                        </div>

                        <div className="mt-10 text-center mr-5">
                            <p className={`mt-2.5 text-xl font-bold`}>
                                {sentences[0]}
                                {' '}
                                <span className={genderDetected === maleText ? 'text-blue-500' : genderDetected === femaleText ? 'text-pink-500' : ''}>
                                    {genderDetected}
                                </span>
                                {sentences[1]}
                            </p>    
                        </div>

                        <div className="mt-8 mb-4 flex justify-center">
                            <button 
                                className=" bg-main-color text-white font-bold py-2 px-4 rounded w-1/3"
                                onClick={()=>{setGenderResult(null)}}>
                                다시하기
                            </button>
                        </div>
                        
                    </div>
                </div>
            </Mobile>
        </div>
    );
}