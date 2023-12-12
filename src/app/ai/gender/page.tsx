"use client";
import Gender from "@/components/ai/Gender";
import GenderResult from "@/components/ai/GenderResult";
import { useState } from "react";

export default function GenderDiscriminationPage() {

  const [genderResult, setGenderResult] = useState(null);
  
  return (
    <div>

      {genderResult ? (
        <GenderResult genderResult={genderResult} setGenderResult={setGenderResult}/>
      ) : (
        <Gender setGenderResult={setGenderResult}/>
      )}
      
    </div>
  );
}
