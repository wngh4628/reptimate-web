"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Mobile, PC } from "../ResponsiveLayout";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoggedInState, userAtom } from "@/recoil/user";
import { getResponseAuction, Auction } from "@/service/my/auction";
import Link from "next/link";

export default function AiMain() {
  return (
    <div className="flex flex-wrap mb-10 justify-center">
      <div className="mt-10 ml-10 mr-10 relative">
        <h3 className="font-bold mb-2 text-xl mx-1">모프 가치 판단</h3>
        <Link href={`/ai/value`}>
          <article className="flex flex-col items-center">
            <div className="relative w-[500px] h-[300px] overflow-hidden shadow-md shadow-gray-400 hover:border-2 hover:border-main-color rounded-lg">
              <img
                className="object-cover w-full h-full"
                src={"/img/reptimate_logo.png"}
              />
            </div>
          </article>
        </Link>
        <p className="mt-2 text-lg ml-1 break-text">
          보유하고 있는 크레스티드 게코의 모프 가치를 판단
        </p>
      </div>

      <div className="mt-10 ml-10 mr-10 relative">
        <h3 className="font-bold mb-2 text-xl mx-1">
          인공지능 브리딩 라인 추천
        </h3>
        <Link href={`/ai/linebreeding`}>
          <article className="flex flex-col items-center">
            <div className="relative w-[500px] h-[300px] overflow-hidden shadow-md shadow-gray-400 hover:border-2 hover:border-main-color rounded-lg">
              <img
                className="object-cover w-full h-full"
                src={"/img/reptimate_logo.png"}
              />
            </div>
          </article>
        </Link>
        <p className="mt-2 text-lg ml-1 break-words">
          보유하고 있는 크레스티드 게코의 모프 가치를 판단
        </p>
      </div>

      <div className="mt-10 ml-10 mr-10 relative">
        <h3 className="font-bold mb-2 text-xl mx-1">암수 구분 기능</h3>
        <Link href={`/ai/gender`}>
          <article className="flex flex-col items-center">
            <div className="relative w-[500px] h-[300px] overflow-hidden shadow-md shadow-gray-400 hover:border-2 hover:border-main-color rounded-lg">
              <img
                className="object-cover w-full h-full"
                src={"/img/reptimate_logo.png"}
              />
            </div>
          </article>
        </Link>
        <p className="mt-2 text-lg ml-1 break-words">
          도마뱀의 암수를 구별해주는 기능
        </p>
      </div>

      <div className="mt-10 ml-10 mr-10 relative">
        <h3 className="font-bold mb-2 text-xl mx-1">가상 브리딩</h3>
        <Link href={`/ai/virtualbreeding`}>
          <article className="flex flex-col items-center">
            <div className="relative w-[500px] h-[300px] overflow-hidden shadow-md shadow-gray-400 hover:border-2 hover:border-main-color rounded-lg">
              <img
                className="object-cover w-full h-full"
                src={"/img/reptimate_logo.png"}
              />
            </div>
          </article>
        </Link>
        <p className="mt-2 text-lg ml-1 break-words">
          도마뱀 암수 사진을 올리면 나올 수 있는 자손 사진을 생성
        </p>
      </div>
    </div>
  );
}
