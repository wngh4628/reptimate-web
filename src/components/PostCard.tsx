import { Post } from "@/service/posts";
import Image from "next/image";
import Link from "next/link";

type Props = { post: Post };
export default function PostCard({
  post: { title, description, date, category, path },
}: Props) {
  return (
    <div className="ml-5 mr-5">
      <Link href={`/posts/${path}`}>
        <article className="flex flex-col items-center">
          <div className="relative w-[350px] h-[350px] rounded-md overflow-hidden shadow-lg">
            <Image
              className="object-cover w-full h-full"
              src={`/images/posts/${path}.png`}
              alt={title}
              layout="fill"
            />
          </div>
        </article>
      </Link>
      <div className="flex flex-col items-center">
        <time>{date.toString()}</time>
        <h3>{title}1</h3>
        <p>{description}</p>
        <span>{category}</span>
      </div>
    </div>
  );
}
