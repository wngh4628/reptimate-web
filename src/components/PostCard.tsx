import { Post } from "@/service/posts";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { Mobile, PC } from "./ResponsiveLayout";

type Props = { post: Post };
export default function PostCard({
  post: { view, userIdx, title, category, description, writeDate, coverImage },
}: Props) {
  return (
    <div className="ml-5 mr-5">
      <Link href={`/posts/${userIdx}`}>
        <article className="flex flex-col items-center">
          <PC>
            <div className="relative w-[350px] h-[350px] rounded-md overflow-hidden shadow-lg">
              <Image
                className="object-cover w-full h-full"
                src={`${coverImage}`}
                alt={""}
                layout="fill"
              />
            </div>
          </PC>
          <Mobile>
            <div className="relative w-[170px] h-[170px] rounded-md overflow-hidden shadow-lg">
              <Image
                className="object-cover w-full h-full"
                src={`${coverImage}`}
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
