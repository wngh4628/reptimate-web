import { Board } from "@/service/my/board";
import Link from "next/link";
import { Mobile, PC } from "../../ResponsiveLayout";

type Props = { post: Board };
export default function BoardItem({
  post: { idx, view, userIdx, title, category, writeDate },
}: Props) {
  if(category == "auction") {
    // return null;
  }
  const dateFormatted = `${writeDate.getFullYear().toString().slice(2)}.${(
    writeDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}.${writeDate
    .getDate()
    .toString()
    .padStart(2, "0")}`

  return (
    <div className="w-full h-[60px] p-2 border-gray-200 border-[1px] flex items-center">
      <Link href={`/community/${category}/posts/${idx}`} className="w-full">
        <div className="w-full flex flex-row">
          <PC>
            <h3 className="flex font-bold text-xl mx-1 w-4/5">{title}</h3>
          </PC>
          <Mobile>
            <h3 className="flex font-bold text-base mx-1 w-3/5">{title}</h3>
          </Mobile>

          <PC>
            <div className="flex items-center ml-auto mr-0">
              {/* 조회수 */}
              <img className="flex w-4 mx-1" src="/img/eye.png" />
              <p className="mr-[5px]">{view}</p>

              {/* 작성일 */}
              <img className="flex w-3 mx-1" src="/img/clock.png" />
              <p className="">{dateFormatted}</p>
            </div>
          </PC>
          <Mobile>
            <div className="flex items-center ml-auto mr-0">
              {/* 조회수 */}
              <img className="flex w-3 mx-1" src="/img/eye.png" />
              <p className="mr-[3px] text-sm">{view}</p>

              {/* 작성일 */}
              <img className="flex w-3 mx-1" src="/img/clock.png" />
              <p className="text-sm">{dateFormatted}</p>
            </div>
          </Mobile>
          
          
        </div>
      </Link>
    </div>
  );
}
