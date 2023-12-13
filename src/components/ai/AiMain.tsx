"use client";

import { Mobile, PC } from "../ResponsiveLayout";
import Link from "next/link";
import Image from "next/image";

export default function AiMain() {
  return (
    <div>
      <PC>
        <div className="flex flex-wrap mb-10 justify-center mt-[110px]">
          <div className="mt-10 ml-10 mr-10 relative">
            <h3 className="font-bold mb-2 text-xl mx-1">모프 가치 판단</h3>
            <Link href={`/ai/valueanalysis`}>
              <article className="flex flex-col items-center">
                <div className="relative w-[500px] h-[300px] overflow-hidden shadow-md shadow-gray-400 hover:border-2 hover:border-main-color rounded-lg">
                  <img
                    className="object-cover w-full h-full"
                    src={"/img/ai_value.png"}
                    width={500}
                    height={300}
                    alt={""}
                    style={{ zIndex: 1 }}
                  />
                </div>
              </article>
            </Link>
            <p className="mt-2 text-lg ml-1 break-text">
              보유하고 있는 크레스티드 게코의 모프 가치를 판단
            </p>
          </div>

          <div className="mt-10 ml-10 mr-10 relative">
            <h3 className="font-bold mb-2 text-xl mx-1">브리딩 라인 추천</h3>
            <Link href={`/ai/linebreeding`}>
              <article className="flex flex-col items-center">
                <div className="relative w-[500px] h-[300px] overflow-hidden shadow-md shadow-gray-400 hover:border-2 hover:border-main-color rounded-lg">
                  <img
                    className="object-cover w-full h-full"
                    src={"/img/ai_linebreeding.png"}
                    width={500}
                    height={300}
                    alt={""}
                    style={{ zIndex: 1 }}
                  />
                </div>
              </article>
            </Link>
            <p className="mt-2 text-lg ml-1 break-words">
              보유하고 있는 크레스티드 게코의 브리딩 라인을 추천
            </p>
          </div>

          <div className="mt-10 ml-10 mr-10 relative">
            <h3 className="font-bold mb-2 text-xl mx-1">암수 구분 기능</h3>
            <Link href={`/ai/gender`}>
              <article className="flex flex-col items-center">
                <div className="relative w-[500px] h-[300px] overflow-hidden shadow-md shadow-gray-400 hover:border-2 hover:border-main-color rounded-lg">
                  <img
                    className="object-cover w-full h-full"
                    src={"/img/ai_gender.png"}
                    width={500}
                    height={300}
                    alt={""}
                    style={{ zIndex: 1 }}
                  />
                </div>
              </article>
            </Link>
            <p className="mt-2 text-lg ml-1 break-words">
              도마뱀의 암수를 구별해주는 기능
            </p>
          </div>

          <div className="mt-10 ml-10 mr-10 relative">
            <h3 className="font-bold mb-2 text-xl mx-1">사육 챗봇</h3>
            <Link href={`/ai/aibreeder`}>
              <article className="flex flex-col items-center">
                <div className="relative w-[500px] h-[300px] overflow-hidden shadow-md shadow-gray-400 hover:border-2 hover:border-main-color rounded-lg">
                  <img
                    className="object-cover w-full h-full"
                    src={"/img/ai_chatting.png"}
                    width={500}
                    height={300}
                    alt={""}
                    style={{ zIndex: 1 }}
                  />
                </div>
              </article>
            </Link>
            <p className="mt-2 text-lg ml-1 break-words">
              크레스티드 개코에 대한 질문에 답변을 해주는 AI사육사
            </p>
          </div>
        </div>
      </PC>

      <Mobile>
        <div className="flex flex-wrap mb-10 justify-center mt-[110px]">
          <div className="mt-10 ml-10 mr-10 relative">
            <h3 className="font-bold mb-2 text-xl mx-1">모프 가치 판단</h3>
            <Link href={`/ai/valueanalysis`}>
              <article className="flex flex-col items-center">
                <div className="relative w-full h-full overflow-hidden shadow-md shadow-gray-400 hover:border-2 hover:border-main-color rounded-lg">
                  <img
                    className="object-cover w-full h-full"
                    src={"/img/ai_value.png"}
                    width={500}
                    height={300}
                    alt={""}
                    style={{ zIndex: 1 }}
                  />
                </div>
              </article>
            </Link>
            <p className="mt-2 text-lg ml-1 break-text">
              보유하고 있는 크레스티드 게코의 모프 가치를 판단
            </p>
          </div>

          <div className="mt-10 ml-10 mr-10 relative">
            <h3 className="font-bold mb-2 text-xl mx-1">브리딩 라인 추천</h3>
            <Link href={`/ai/linebreeding`}>
              <article className="flex flex-col items-center">
                <div className="relative w-full h-full overflow-hidden shadow-md shadow-gray-400 hover:border-2 hover:border-main-color rounded-lg">
                  <img
                    className="object-cover w-full h-full rounded-md"
                    src={"/img/ai_linebreeding.png"}
                    width={500}
                    height={300}
                    alt={""}
                  />
                </div>
              </article>
            </Link>
            <p className="mt-2 text-lg ml-1 break-words">
              보유하고 있는 크레스티드 게코의 브리딩 라인을 추천
            </p>
          </div>

          <div className="mt-10 ml-10 mr-10 relative">
            <h3 className="font-bold mb-2 text-xl mx-1">암수 구분 기능</h3>
            <Link href={`/ai/gender`}>
              <article className="flex flex-col items-center">
                <div className="relative w-full h-full overflow-hidden shadow-md shadow-gray-400 hover:border-2 hover:border-main-color rounded-lg">
                  <img
                    className="object-cover  w-full h-full rounded-md"
                    src={"/img/ai_gender.png"}
                    width={500}
                    height={300}
                    alt={""}
                    style={{ zIndex: 1 }}
                  />
                </div>
              </article>
            </Link>
            <p className="mt-2 text-lg ml-1 break-words">
              도마뱀의 암수를 구별해주는 기능
            </p>
          </div>

          <div className="mt-10 ml-10 mr-10 relative">
            <h3 className="font-bold mb-2 text-xl mx-1">사육 챗봇</h3>
            <Link href={`/ai/aibreeder`}>
              <article className="flex flex-col items-center">
                <div className="relative w-full h-full overflow-hidden shadow-md shadow-gray-400 hover:border-2 hover:border-main-color rounded-lg">
                  <img
                    className="object-cover w-full h-full rounded-md"
                    src={"/img/ai_chatting.png"}
                    width={500}
                    height={300}
                    alt={""}
                    style={{ zIndex: 1 }}
                    loading="lazy"
                  />
                </div>
              </article>
            </Link>
            <p className="mt-2 text-lg ml-1 break-words">
              크레스티드 개코에 대한 질문에 답변을 해주는 AI사육사
            </p>
          </div>
        </div>
      </Mobile>
    </div>
  );
}
