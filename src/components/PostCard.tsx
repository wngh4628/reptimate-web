import { Post } from "@/service/posts";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

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
              src="https://reptimate.s3.ap-northeast-2.amazonaws.com/test/20230629233509-e04030ed-107c-4fc7-93b9-d44fad9469d7-video.jpg"
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
