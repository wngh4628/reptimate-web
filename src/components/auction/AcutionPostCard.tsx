import { Auction } from "@/service/my/auction";
import Image from "next/image";
import Link from "next/link";
import { Mobile, PC } from "../ResponsiveLayout";

type Props = { post: Auction };
export default function AuctionPostCard({
  post: {
    idx,
    createdAt,
    currentPrice,
    unit,
    endTime,
    gender,
    size,
    variety,
    state,
    title,
    coverImage,
    profilePath,
    nickname,
  },
}: Props) {
  function formatDateToCustomString(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("ko-KR", options).format(date);
  }

  function setStateString(state: string): string {
    let str = "";
    if (state == "selling") {
      str = "진행중";
    } else if (state == "end") {
      str = "종료";
    } else {
      str = "임시저장";
    }
    return str;
  }
  const imgStyle = {
    paddingBottom: "100%",
    position: "relative" as "relative",
  };
  return (
    <div>
      <div className="ml-0.5 mr-0.5 relative">
        <Link href={`/auction/posts/${idx}`}>
          <article className="flex flex-col items-center">
            <PC>
              <div className="relative w-[350px] h-[350px] overflow-hidden shadow-md shadow-gray-400 hover:border-2 hover:border-main-color rounded-lg">
                <div className="absolute inset-0 top-1/2 bg-gradient-to-t from-gray-400 via-transparent to-transparent z-10"></div>
                <img
                  className="object-cover w-full h-full"
                  src={`${coverImage}` || "/img/reptimate_logo.png"}
                  alt={""}
                  style={{ zIndex: 1 }}
                />
              </div>
              <div className="absolute right-6 mt-2 flex items-center z-[999]">
                <p
                  className={`${
                    state === "selling"
                      ? "text-red-500"
                      : state === "end"
                      ? "text-gray-400"
                      : "text-main-color"
                  } text-xl font-bold z-[999] relative mt-1`}
                >
                  {setStateString(state)}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 mb-2 flex items-center z-20">
                <img
                  className="ml-6 w-10 h-10 rounded-full border-2"
                  src={
                    profilePath !== null
                      ? profilePath
                      : "/img/reptimate_logo.png"
                  }
                  alt={""}
                />
                <p className="text-white font-semibold ml-1">{nickname}</p>
              </div>
            </PC>
            <Mobile>
              <div className="relative w-full overflow-hidden shadow-sm shadow-gray-400 hover:border-2 hover:border-main-color">
                <div className="absolute inset-0 top-1/2 bg-gradient-to-t from-gray-400 via-transparent to-transparent z-10"></div>
                <div style={imgStyle}>
                  <img
                    className="object-cover absolute inset-0 w-full h-full"
                    src={`${coverImage || "/img/reptimate_logo.png"}`}
                    alt=""
                    style={{ zIndex: 1 }}
                  />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 mb-2 flex items-center z-20">
                <img
                  className="ml-2 w-8 h-8 rounded-full border-2"
                  src={
                    profilePath !== null
                      ? profilePath
                      : "/img/reptimate_logo.png"
                  }
                  alt={""}
                />
                <p className="text-white font-semibold ml-1 text-sm">
                  {nickname}
                </p>
              </div>
              <div className="absolute right-2 mt-2 flex items-center z-[999]">
                <p
                  className={`${
                    state === "selling"
                      ? "text-red-500"
                      : state === "end"
                      ? "text-gray-400"
                      : "text-main-color"
                  } text-lg font-bold z-[999] relative`}
                >
                  {setStateString(state)}
                </p>
              </div>
            </Mobile>
          </article>
        </Link>
      </div>

      <div className=" mx-1 mt-2 mb-6 flex flex-col">
        <PC>
          <h3 className="font-bold ml-4 text-xl mx-1">{title}</h3>
          <div className="w-full flex flex-row items-center">
            <p className="text-sm ml-4 mr-1">
              {state === "selling" ? "현재 입찰가 : " : "낙찰가 : "}
            </p>
            <p className="font-bold text-lg">
              {currentPrice ? currentPrice : "---"}
            </p>
            <p className="text-sm ml-1">원</p>
          </div>
          <div className="flex ml-3 items-center">
            <p
              className={`text-xs mx-1 text-white p-1 rounded font-bold ${
                gender === "수컷"
                  ? "bg-gender-male-color"
                  : gender === "암컷"
                  ? "bg-gender-female-color"
                  : "bg-gray-400"
              }`}
            >
              {gender}
            </p>
            <p className="text-xs mx-1 text-white bg-gray-400 p-1 rounded font-bold">
              {size}
            </p>
          </div>
          <div className="flex items-center ml-4">
            <img className="flex w-[15px] mx-1" src="/img/clock.png" />
            <p className="text-gray-500 text-[15px]">
              {formatDateToCustomString(createdAt)}
            </p>
          </div>
        </PC>
        <Mobile>
          <h3 className="font-bold ml-1 text-xl mx-1">{title}</h3>
          <div className="w-full flex flex-row items-center">
            <p className="text-sm ml-1 mr-1">
              {state === "selling" ? "현재 입찰가 : " : "낙찰가 : "}
            </p>
            <p className="font-bold text-lg">
              {currentPrice ? currentPrice : "---"}
            </p>
            <p className="text-sm ml-1">원</p>
          </div>
          <div className="flex items-center">
            <p
              className={`text-xs ml-1 text-white p-1 rounded font-bold ${
                gender === "수컷"
                  ? "bg-gender-male-color"
                  : gender === "암컷"
                  ? "bg-gender-female-color"
                  : "bg-gray-400"
              }`}
            >
              {gender}
            </p>
            <p className="text-xs mx-1 text-white bg-gray-400 p-1 rounded font-bold">
              {size}
            </p>
          </div>
          <div className="flex items-center mt-1">
            <img className="flex w-[15px] mx-1" src="/img/clock.png" />
            <p className="text-gray-500 text-[15px]">
              {formatDateToCustomString(createdAt)}
            </p>
          </div>
        </Mobile>
      </div>
    </div>
  );
}
