"use client";
import AiMenu from "@/components/AiMenu";
import Gender from "@/components/ai/Gender";
import GenderResult from "@/components/ai/GenderResult";
import { useState } from "react";

export default function GenderDiscriminationPage() {

  const [genderResult, setGenderResult] = useState(null);

  const setFunctionList = [setGenderResult]
  
  return (
    <div>

      <AiMenu setFunctionList={setFunctionList}/>

      {genderResult ? (
        <GenderResult genderResult={genderResult} setGenderResult={setGenderResult}/>
      ) : (
        <Gender setGenderResult={setGenderResult}/>
      )}
      
    </div>
  );
}
