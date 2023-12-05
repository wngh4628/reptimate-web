"use client";
import AiMenu from "@/components/ai/AiMenu";
import MorphCard from "@/components/MorphCard";
import MorphInfo from "@/components/ai/MorphInfo";
import ValueAnalysisResult from "@/components/ai/ValueAnalysisResult";
import { useState } from "react";

export default function ValueAnalysisPage() {

  const [valueAnalysisResult, setValueAnalysisResult] = useState(null);

  const setFunctionList = [setValueAnalysisResult]

  return (
    <div>
      <AiMenu setFunctionList={setFunctionList}/>
      
      {valueAnalysisResult ? (
        <ValueAnalysisResult valueAnalysisResult={valueAnalysisResult}/>
      ) : (
        <MorphInfo analysisPurpose="valueAnalysis" setValueAnalysisResult={setValueAnalysisResult}/>
      )}
    </div>
  );
}