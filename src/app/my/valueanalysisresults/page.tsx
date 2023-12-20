"use client";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import MypageMenu from "@/components/mypage/MypageMenu";
import BookmarkList from "@/components/mypage/bookmark/Bookmark";
import { Mobile, PC } from "@/components/ResponsiveLayout";
import ValueAnalysisResults from "@/components/mypage/valueanalysisresults/ValueAnalysisResults";
import ValueAnalysisResult from "@/components/ai/ValueAnalysisResult";

export default function ValueAnalysisResultsPage() {

  const [valueAnalysisResult, setValueAnalysisResult] = useState(null);

  return (
    <div>
      <PC>

      {valueAnalysisResult ? (
          <ValueAnalysisResult valueAnalysisResult={valueAnalysisResult} isFromMyPage={true} setValueAnalysisResult={setValueAnalysisResult}/>
        ) :
        <div className="flex mt-[150px] w-[90%] m-auto justify-center content-center">
          <MypageMenu />
          <ValueAnalysisResults setValueAnalysisResult={setValueAnalysisResult} />
        </div>
      }

      </PC>

      <Mobile>

        {valueAnalysisResult ? (
            <ValueAnalysisResult valueAnalysisResult={valueAnalysisResult} isFromMyPage={true} setValueAnalysisResult={setValueAnalysisResult}/>
          ) :
          <div className="flex mt-[10px] w-[90%] m-auto justify-center content-center flex-col">
            <MypageMenu />
            <ValueAnalysisResults setValueAnalysisResult={setValueAnalysisResult} />
          </div>
        }
      </Mobile>
    </div>
  );
}
