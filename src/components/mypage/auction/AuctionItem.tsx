import { Auction } from "@/service/auction";
import Image from "next/image";
import Link from "next/link";
import { Mobile, PC } from "../../ResponsiveLayout";

type Props = { post: Auction };
export default function AuctionItem({
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
  },
}: Props) {
  function formatDateToCustomString(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
  
    return new Intl.DateTimeFormat('ko-KR', options).format(date);
}


  return (
    <div>
      <div className="ml-5 mr-5 relative">
        <Link href={`/community/${idx}`}>
          <article className="flex flex-col items-center">
            <PC>
              <div className="relative w-full h-[320px] overflow-hidden shadow-md shadow-gray-400 hover:border-2 hover:border-main-color rounded-lg">
                <div className="absolute inset-0 top-1/2 bg-gradient-to-t from-gray-400 via-transparent to-transparent z-10"></div>
                <Image
                  className="object-cover w-full h-full"
                  src={`${coverImage}` || "/img/reptimate_logo.png"}
                  alt={""}
                  layout="fill"
                  style={{ zIndex: 1 }}
                />
              </div>
              
            </PC>
            <Mobile>
              <div className="relative w-[120px] h-[120px] overflow-hidden shadow-md shadow-gray-400 hover:border-2 hover:border-main-color rounded-lg">
                <div className="absolute inset-0 top-1/2 bg-gradient-to-t from-gray-400 via-transparent to-transparent z-10"></div>
                <Image
                  className="object-cover w-full h-full"
                  src={`${coverImage}` || "/img/reptimate_logo.png"}
                  alt={""}
                  layout="fill"
                  style={{ zIndex: 1 }}
                />
              </div>
              
            </Mobile>
          </article>
        </Link>
      </div>


      <div className="mx-3 mt-2 mb-6 flex flex-col">
        <h3 className="font-bold text-xl mx-1">{title}</h3>
        <PC>
          <div className="flex items-center flex-col">

            <div className="w-full flex flex-row items-center">
              <p className="text-sm mr-1">현재 입찰가 : </p>
              <p className="font-bold text-lg">{currentPrice ? currentPrice : "---"}</p>
              <p className="text-sm ml-1">원</p>
            </div>
        
            <div className="flex flex-row mt-1 mr-auto">
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
            
          </div>
        </PC>
        <div className="flex items-center mt-1">
          <img className="flex w-5 mx-1" src="/img/clock.png" />
          <p className="">{formatDateToCustomString(createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
