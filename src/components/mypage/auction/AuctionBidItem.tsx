import { Post } from "@/service/posts";
import { Reply } from "@/service/reply";
import { Bid } from "@/service/my/auction";
import Image from "next/image";
import Link from "next/link";

type Props = { post: Bid };
export default function AuctionBidItem({
  post: {
    idx,
    createdAt,
    updatedAt,
    deletedAt,
    type,
    score,
    roomIdx,
    userIdx,
    message,
    title,
    action,
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
  function formatNumberWithCommas(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className="w-full h-[160px] p-2 border-gray-200 border-[1px] rounded-[12px] mb-[5px] shadow">
      <Link href={`/community/posts/${idx}`}>
        <div className="w-full flex flex-col">
          <div className="border-b-[1px] h-[85px] pt-[10px]">
            <div className="flex flex-row mx-1">
              <h2 className=" text-xl">{title}</h2>
            </div>
            <p className="text-gray-500 mt-auto mx-1 ">
              {formatDateToCustomString(createdAt)}
            </p>
          </div>
          <div className="flex items-center h-[65px]">
            <h3 className="font-bold text-xl mx-1">
              내 입찰 금액 : {formatNumberWithCommas(message)}원
            </h3>
          </div>
        </div>
      </Link>
    </div>
  );
}
