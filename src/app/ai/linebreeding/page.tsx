"use client"
import AiMenu from "@/components/AiMenu";
import LineBreedingResult from "@/components/ai/LineBreedingResult";
import MorphInfo from "@/components/ai/MorphInfo";
import ValueAnalysisResult from "@/components/ai/ValueAnalysisResult";
import { useState } from "react";

export default function LineBreedingPage() {

  const [valueAnalysisResult, setValueAnalysisResult] = useState(null);
  const [lineBreedingResult, setLineBreedingResult] = useState(null);
  const [morphInfo, setMorphInfo] = useState(null);

  const setFunctionList = [setValueAnalysisResult, setLineBreedingResult, setMorphInfo];

  return (
    /*
    valueAnalysisResult가 null이 아니면 <ValueAnalysisResult />만 보여주고,
    valueAnalysisResult가 null이고,
      lineBreedingResult도 null이면 <MorphInfo />만 보여주고,
      lineBreedingResult가 null이 아니면 <ValueAnalysisResult />만 보여준다.
    */
    <div>
      <AiMenu setFunctionList={setFunctionList}/>

      {valueAnalysisResult ? (
        <ValueAnalysisResult valueAnalysisResult={valueAnalysisResult} />
      ) : (
        lineBreedingResult ? (
          <LineBreedingResult lineBreedingResult={lineBreedingResult} setValueAnalysisResult={setValueAnalysisResult} morphInfo ={morphInfo}/>
        ) : (
          <MorphInfo analysisPurpose="lineBreeding" setLineBreedingResult={setLineBreedingResult} setMorphInfo ={setMorphInfo}/>
        )
      )}
    </div>
  );
}