import { Reply } from "@/service/reply";
import Link from "next/link";
import { Mobile, PC } from "../../ResponsiveLayout";

type Props = { post: Reply };
export default function BoardReplyItem({
  post: {
    idx,
    title,
    category,
    boardCategory,
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
      <Link href={ boardCategory == "auction" ? `/auction/posts/${boardIdx}` : `/community/${boardCategory}/posts/${boardIdx}`}>
        <div className="w-full flex flex-col">
          <div className="border-b-[1px] h-[85px] pt-[10px]">
            <div className="flex flex-row mx-1 justify-between mb-2">
              <PC>
                <h2 className="ml-[5px] text-xl">{description}</h2>
              </PC>
              <Mobile>
                <h2 className="ml-[5px] text-base">{description}</h2>
              </Mobile>

              <PC>
              {category == "reply" ? (
                <p className="mr-[10px] text-gray-400 text-xl">답글</p>
                
              ) : (
                <p className="mr-[10px] text-gray-400 text-xl">댓글</p>
              )}
              </PC>
              <Mobile>
              {category == "reply" ? (
                <p className="mr-[10px] text-gray-400 text-base">답글</p>
                
              ) : (
                <p className="mr-[10px] text-gray-400 text-base">댓글</p>
              )}
              </Mobile>


            </div>
            {/* 작성일 */}
            <p className="text-gray-500 mt-auto mx-1 ml-[5px]">
              {formatDateToCustomString(createdAt)}
            </p>
          </div>
          <div className="flex items-center h-[65px]">
              <PC>
                <h3 className="font-bold text-xl mx-1">{title}</h3>
              </PC>
              <Mobile>
                <h3 className="font-bold text-base mx-1">{title}</h3>
              </Mobile>
          </div>
        </div>
      </Link>
    </div>
  );
}
