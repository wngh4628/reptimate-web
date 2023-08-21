"use client";

import { getResponse, Post } from "@/service/posts";
import { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "./PostCard";

export default function CommunityHomePosts() {
  // 1. 모든 포스트 데이터를 읽어와야 함
  const [data, setData] = useState<getResponse | null>(null);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const response = await axios.get(
          "http://3.35.87.48:3000/board?page=1&size=20&order=DESC&category=free"
        );
        setData(response.data);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  if (data !== null && data.result.items) {
    const itemlist: Post[] = data.result.items.map((item) => ({
      view: item.view,
      userIdx: item.userIdx,
      title: item.title,
      category: item.category,
      description: item.description,
      writeDate: new Date(item.writeDate),
    }));

    return (
      <section>
        <h2 className="text-2xl font-bold p-10">분양글</h2>
        <ul className="pl-10 pr-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {itemlist.map((post) => (
            <li key={post.userIdx}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </section>
    );
  } else {
    return [];
  }
}
