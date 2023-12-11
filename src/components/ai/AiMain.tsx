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
                    src={"/img/value_analysis.png"}
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
                    src={"/img/line_breeding.png"}
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
                    src={"/img/gender.jpeg"}
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
                    src={"/img/reptimate_logo.png"}
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
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 pr-[16px] pl-[16px] mt-12">
          <div className="w-[183.5px]" >
            <h3 className="font-bold mb-2 text-xl">모프 가치 판단</h3>
            <Link href={`/ai/valueanalysis`}>
              <img
                className="object-cover w-[183.5px] h-[183.5px] rounded-md"
                src={"/img/value_analysis.png"}
                width={183.5}
                height={183.5}
                alt={""}
              />
            </Link>
            <p className="mt-2 text-mg ml-1 break-text">
              보유하고 있는 크레스티드 게코의 모프 가치를 판단
            </p>
          </div>

          <div className="w-[183.5px] rounded-md">
            <h3 className="font-bold mb-2 text-xl">브리딩 라인 추천</h3>
            <Link href={`/ai/linebreeding`}>
                <img
                  className="object-cover w-[183.5px] h-[183.5px] rounded-md"
                  src={"/img/line_breeding.png"}
                  width={183.5}
                  height={183.5}
                  alt={""}
                />
            </Link>
            <p className="mt-2 text-mg ml-1 break-words">
              보유하고 있는 크레스티드 게코의 브리딩 라인을 추천
            </p>
          </div>

          <div className="w-[183.5px] rounded-md">
            <h3 className="font-bold mb-2 text-xl">암수 구분 기능</h3>
            <Link href={`/ai/gender`}>
              <img
                  className="object-cover  w-[183.5px] h-[183.5px] rounded-md"
                  src={"/img/gender.jpeg"}
                  width={183.5}
                  height={183.5}
                  alt={""}
                  style={{ zIndex: 1 }}
                />
            </Link>
            <p className="mt-2 text-mg ml-1 break-words">
              도마뱀의 암수를 구별해주는 기능
            </p>
          </div>

          <div className="w-[183.5px] rounded-md">
            <h3 className="font-bold mb-2 text-xl">사육 챗봇</h3>
            <Link href={`/ai/aibreeder`}>
              <img
                  className="object-cover w-[183.5px] h-[183.5px] rounded-md"
                  src={"/img/reptimate_logo.png"}
                  width={500}
                  height={300}
                  alt={""}
                  style={{ zIndex: 1 }}
                  loading="lazy"
                />
            </Link>
            <p className="mt-2 text-mg ml-1 break-words">
              크레스티드 개코에 대한 질문에 답변을 해주는 AI사육사
            </p>
          </div>
        </div>
      </Mobile>
    </div>
  );
}
