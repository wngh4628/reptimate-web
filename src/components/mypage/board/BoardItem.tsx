import { Post } from "@/service/posts";
import { Board } from "@/service/my/board";
import Image from "next/image";
import Link from "next/link";

type Props = { post: Board };
export default function BoardItem({
  post: { idx, view, userIdx, title, category, writeDate },
}: Props) {
  return (
    <div className="w-full h-[60px] p-2 border-gray-200 border-[1px]">
      <Link href={`/community/${category}/posts/${idx}`}>
        <div className="w-full flex">
          <h3 className="font-bold text-xl mx-1">{title}</h3>

          <div className="flex items-center mt-1 ml-auto">
            {/* 조회수 */}
            <img className="flex w-4 mx-1" src="/img/eye.png" />
            <p className="mr-[5px]">{view}</p>

            {/* 작성일 */}
            <img className="flex w-3 mx-1" src="/img/clock.png" />
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
      </Link>
    </div>
  );
}
