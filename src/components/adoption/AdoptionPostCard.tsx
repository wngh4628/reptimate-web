import { Adpotion } from "@/service/adoption";
import Image from "next/image";
import Link from "next/link";
import { Mobile, PC } from "../ResponsiveLayout";

type Props = { post: Adpotion };
export default function PostCard({
  post: {
    idx,
    view,
    userIdx,
    title,
    category,
    writeDate,
    coverImage,
    nickname,
    profilePath,
    price,
    gender,
    size,
    variety,
    state,
  },
}: Props) {
  return (
    <div>
      <div className="ml-5 mr-5 relative">
        <Link href={`/posts/${idx}`}>
          <article className="flex flex-col items-center">
            <PC>
              <div className="relative w-[350px] h-[350px] overflow-hidden shadow-md shadow-gray-400 hover:border-2 hover:border-main-color rounded-lg">
                <div className="absolute inset-0 top-1/2 bg-gradient-to-t from-gray-400 via-transparent to-transparent z-10"></div>
                <Image
                  className="object-cover w-full h-full"
                  src={`${coverImage}` || "/img/reptimate_logo.png"}
                  alt={""}
                  layout="fill"
                  style={{ zIndex: 1 }}
                />
              </div>
              <div className="absolute bottom-0 left-0 mb-2 flex items-center z-20">
                <img
                  className="w-10 h-10 rounded-full border-2"
                  src={`${profilePath}` || "/img/reptimate_logo.png"}
                  alt={""}
                />
                <p className="text-white font-semibold ml-1">{nickname}</p>
              </div>
            </PC>
            <Mobile>
              <div className="relative w-[130px] h-[130px] overflow-hidden shadow-md shadow-gray-400 hover:border-2 hover:border-main-color rounded-lg">
                <div className="absolute inset-0 top-1/2 bg-gradient-to-t from-gray-400 via-transparent to-transparent z-10"></div>
                <Image
                  className="object-cover w-full h-full"
                  src={`${coverImage}` || "/img/reptimate_logo.png"}
                  alt={""}
                  layout="fill"
                  style={{ zIndex: 1 }}
                />
              </div>
              <div className="absolute bottom-0 left-0 mb-2 flex items-center z-20">
                <img
                  className="w-7 h-7 rounded-full border-2"
                  src={`${profilePath}` || "/img/reptimate_logo.png"}
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
      <div className="mx-3 mt-2 mb-6 flex flex-col">
        <h3 className="font-bold text-xl mx-1">{title}</h3>
        <PC>
          <div className="flex items-center">
            <p className="font-bold text-lg ml-1">{price}원</p>
            <p className="text-xs mx-1 text-white bg-gender-female-color p-1 rounded font-bold">
              {gender}
            </p>
            <p className="text-xs mx-1 text-white bg-gray-400 p-1 rounded font-bold">
              {size}
            </p>
          </div>
        </PC>
        <div className="flex items-center mt-1">
          <img className="flex w-6 mx-1" src="/img/eye.png" />
          <p className="">{view}</p>
          <img className="flex w-5 mx-1" src="/img/clock.png" />
          <p className="">{`${writeDate.getFullYear().toString().slice(2)}.${(
            writeDate.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}.${writeDate
            .getDate()
            .toString()
            .padStart(2, "0")}`}</p>
        </div>
      </div>
    </div>
  );
}
