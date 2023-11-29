"use client";
import AiMenu from "@/components/AiMenu";
import MorphCard from "@/components/MorphCard";
import MorphInfo from "@/components/ai/MorphInfo";
import ValueAnalysisResult from "@/components/ai/ValueAnalysisResult";
import { useState } from "react";

export default function ValueAnalysisPage() {

  const [valueAnalysisResult, setValueAnalysisResult] = useState(null);

  return (
    <div>
      <AiMenu />
      {valueAnalysisResult ? (
        <ValueAnalysisResult valueAnalysisResult={valueAnalysisResult}/>
      ) : (
        <MorphInfo analysisPurpose="valueAnalysis" setValueAnalysisResult={setValueAnalysisResult}/>
      )}
    </div>
  );
}