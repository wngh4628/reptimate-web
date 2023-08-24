import { Post } from "@/service/posts";
import Image from "next/image";
import Link from "next/link";
import { Mobile, PC } from "./ResponsiveLayout";

type Props = { post: Post };
export default function PostCard({
  post: {
    idx,
    view,
    userIdx,
    title,
    category,
    description,
    writeDate,
    coverImage,
  },
}: Props) {
  return (
    <div className="ml-5 mr-5">
      <Link href={`/posts/${idx}`}>
        <article className="flex flex-col items-center">
          <PC>
            <div className="relative w-[350px] h-[350px] rounded-md overflow-hidden shadow-lg group">
              <Image
                className="object-cover w-full h-full group-hover:border-2 group-hover:border-main-color rounded-lg"
                src={`${coverImage}` || "/img/reptimate_logo.png"}
                alt={""}
                layout="fill"
              />
            </div>
          </PC>
          <Mobile>
            <div className="relative w-[170px] h-[170px] rounded-md overflow-hidden shadow-lg group">
              <Image
                className="object-cover w-full h-full group hover:border-2 hover:border-main-color rounded-lg"
                src={`${coverImage}` || "/img/reptimate_logo.png"}
                alt={""}
                layout="fill"
              />
            </div>
          </Mobile>
        </article>
      </Link>
      <div className="flex flex-col items-center">
        {/* <time>{date.toString()}</time> */}
        <h3 className="font-bold text-lg">{title}</h3>
        <p>{description}</p>
        {/* <span>{category}</span> */}
      </div>
    </div>
  );
}
