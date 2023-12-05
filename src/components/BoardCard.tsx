import Image from "next/image";
import Link from "next/link";
import { Mobile, PC } from "./ResponsiveLayout";
import { Posts } from "@/service/my/board";
import { formatTimeDifference, formatViews } from "@/utils/dateFormat";

type Props = { post: Posts };
export default function PostCard({
  post: {
    idx,
    view,
    userIdx,
    title,
    category,
    writeDate,
    thumbnail,
    nickname,
    profilePath,
  },
}: Props) {
  const imgStyle = {
    paddingBottom: "100%",
    position: "relative" as "relative",
  };
  return (
    <div>
      <div className="ml-0.5 mr-0.5 relative">
        <Link
          href={`/community/${category}/posts/[idx]`}
          as={`/community/${category}/posts/${idx}`}
        >
          <article className="flex flex-col items-center">
            <PC>
            <div className="relative w-[233.59px] h-[233.59px] overflow-hidden hover:border-2 hover:border-main-color rounded-md">
            <div className="absolute inset-0 top-1/2 bg-gradient-to-t from-gray-400 via-transparent to-transparent z-10 opacity-40"></div>
                <img
                  className="object-cover w-full h-full"
                  src={
                    thumbnail !== null ? thumbnail : "/img/reptimate_logo.png"
                  }
                  alt={""}
                  style={{ zIndex: 1 }}
                />
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
                <p className="text-white font-semibold ml-1">{nickname}</p>
              </div>
            </PC>
            <Mobile>
              <div className="relative w-full overflow-hidden shadow-sm shadow-gray-400 hover:border-2 hover:border-main-color">
                <div className="absolute inset-0 top-1/2 bg-gradient-to-t from-gray-400 via-transparent to-transparent z-10"></div>
                <div style={imgStyle}>
                  <img
                    className="object-cover absolute inset-0 w-full h-full"
                    src={
                      thumbnail !== null ? thumbnail : "/img/reptimate_logo.png"
                    }
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
            </Mobile>
          </article>
        </Link>
      </div>
      <div className="mt-1 mb-6 flex flex-col">
        <PC>
          <h3 className="font-bold text-[14px]">{title}</h3>
          <div className="flex items-center ">
              <p className="text-[13px] text-[#606060]">조회수</p>
              <p className="text-[13px] text-[#606060] ml-0.5">{formatViews(view)}</p>
              <p className="text-[13px] text-[#606060] ml-1">{formatTimeDifference(writeDate)}</p>
                
            </div>
        </PC>
        <Mobile>
          <h3 className="font-bold ml-1 text-xl mx-1">{title}</h3>
          <div className="flex items-center mt-1 ml-1">
            <img className="flex w-5 mr-1" src="/img/eye.png" />
            <p className="">{view}</p>
            <img className="flex w-4 mx-1" src="/img/clock.png" />
            <p className="">{`${writeDate.getFullYear().toString().slice(2)}.${(
              writeDate.getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}.${writeDate
              .getDate()
              .toString()
              .padStart(2, "0")}`}</p>
          </div>
        </Mobile>
      </div>
    </div>
  );
}
