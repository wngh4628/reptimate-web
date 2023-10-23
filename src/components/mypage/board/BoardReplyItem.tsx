import { Post } from "@/service/posts";
import { Reply } from "@/service/reply";
import Image from "next/image";
import Link from "next/link";

type Props = { post: Reply };
export default function BoardReplyItem({
  post: {
    idx,
    title,
    category,
    createdAt,
    boardIdx,
    userIdx,
    description,
    filePath,
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

  return (
    <div className="w-full h-[160px] p-2 border-gray-200 border-[1px] rounded-[12px] mb-[5px] shadow">
      <Link href={`/community/posts/${idx}`}>
        <div className="w-full flex flex-col">
          <div className="border-b-[1px] h-[85px] pt-[10px]">
            <div className="flex flex-row mx-1">
              <h2 className=" text-xl">{description}</h2>
              {category == "reply" ? (
                <p className="ml-[6px] text-gray-400 text-xl">답글</p>
              ) : (
                <p className="ml-[6px] text-gray-400 text-xl">답글</p>
              )}
            </div>
            {/* 작성일 */}
            <p className="text-gray-500 mt-auto mx-1 ">
              {formatDateToCustomString(createdAt)}
            </p>
          </div>
          <div className="flex items-center h-[65px]">
            <h3 className="font-bold text-xl mx-1">{title}</h3>
          </div>
        </div>
      </Link>
    </div>
  );
}
