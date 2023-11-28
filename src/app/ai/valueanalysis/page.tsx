"use client";
import AiMenu from "@/components/AiMenu";
import MorphCard from "@/components/MorphCard";
import MorphInfo from "@/components/ai/MorphInfo";
import ValueAnalysisResult from "@/components/ai/ValueAnalysisResult";
import { useState } from "react";

export default function ValueAnalysisPage() {

  const [analysisResult, setAnalysisResult] = useState(null);

  return (
    <div>
      <AiMenu />
      {analysisResult ? (
        <ValueAnalysisResult analysisResult={analysisResult}/>
      ) : (
        <MorphInfo analysisPurpose="valueAnalysis" setAnalysisResult={setAnalysisResult} />
      )}
    </div>
  );
}
