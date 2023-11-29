"use client";
import AiMenu from "@/components/AiMenu";
import MorphCard from "@/components/MorphCard";
import MorphInfo from "@/components/ai/MorphInfo";
import ValueAnalysisResult2 from "@/components/ai/ValueAnalysisResult2";
import { useState } from "react";

export default function ValueAnalysisResultPage() {

  return (
    <div>
      <AiMenu />
      <ValueAnalysisResult2 />
    </div>
  );
}