"use client";

import { getResponse, Post } from "@/service/posts";
import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import PostCard from "./PostCard";

export default function CommunityHomePosts() {
  // 1. 모든 포스트 데이터를 읽어와야 함
  const [data, setData] = useState<getResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [ref, inView] = useInView();

  const getItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://3.35.87.48:3000/board?page=${page}&size=20&order=DESC&category=free`
      );
      setData(response.data); // Assuming response.data is an array
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    getItems();
  }, [getItems]);

  useEffect(() => {
    // 사용자가 마지막 요소를 보고 있고, 로딩 중이 아니라면
    if (inView && !loading) {
      setPage((prevState) => prevState + 1);
    }
  }, [inView, loading]);

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
            <li key={post.userIdx} ref={ref}>
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
