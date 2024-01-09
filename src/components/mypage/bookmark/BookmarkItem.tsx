import { BookmarkBoard } from "@/service/my/bookmark";
import Link from "next/link";
import { Mobile, PC } from "../../ResponsiveLayout";

type Props = { post: BookmarkBoard };
export default function BoardItem({
  post: {
    idx,
    createdAt,
    updatedAt,
    deletedAt,
    category,
    userIdx,
    title,
    thumbnail,
    media,
    description,
    view,
    commentCnt,
    status,
    boardCategory,
  },
}: Props) {
  const createdAtFormatted = `${createdAt.getFullYear().toString().slice(2)}.${(
    createdAt.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}.${createdAt
    .getDate()
    .toString()
    .padStart(2, "0")}`

  return (
    <div className="w-full h-[60px] p-2 border-gray-200 border-[1px]">
      {category === "auction" ? 
      <Link href={`/auction/posts/${idx}`}>
      <div className="w-full flex">
        <PC> 
          <h3 className="flex font-bold text-xl mx-1 w-4/5">{title}</h3>
        </PC>
        <Mobile>
          <h3 className="flex font-bold text-base mx-1 w-3/5">{title}</h3>
        </Mobile>

        <PC>
          <div className="flex items-center mt-1 ml-auto">
            {/* 조회수 */}
            <img className="flex w-4 mx-1" src="/img/eye.png" />
            <p className="mr-[5px]">{view}</p>

            {/* 작성일 */}
            <img className="flex w-3 mx-1" src="/img/clock.png" />
            <p className="">{createdAtFormatted}</p>
          </div>
        </PC>
        <Mobile>
          <div className="flex items-center mt-1 ml-auto">
            {/* 조회수 */}
            <img className="flex w-4 mx-1" src="/img/eye.png" />
            <p className="mr-[5px]">{view}</p>

            {/* 작성일 */}
            <img className="flex w-3 mx-1" src="/img/clock.png" />
            <p className="">{createdAtFormatted}</p>
          </div>
        </Mobile>

        
      </div>
    </Link>
     :
     <Link href={`/community/${boardCategory}/posts/${idx}`}>
        <div className="w-full flex">
          <h3 className="font-bold text-xl mx-1">{title}</h3>

          <div className="flex items-center mt-1 ml-auto">
            {/* 조회수 */}
            <img className="flex w-4 mx-1" src="/img/eye.png" />
            <p className="mr-[5px]">{view}</p>

            {/* 작성일 */}
            <img className="flex w-3 mx-1" src="/img/clock.png" />
            <p className="">{`${createdAt.getFullYear().toString().slice(2)}.${(
              createdAt.getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}.${createdAt
              .getDate()
              .toString()
              .padStart(2, "0")}`}</p>
          </div>
        </div>
      </Link>
    }
      
    </div>
  );
}
