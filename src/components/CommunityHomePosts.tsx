"use client";

import { getResponse, Post } from "@/service/posts";
import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import PostCard from "./PostCard";
import { Mobile, PC } from "./ResponsiveLayout";

export default function CommunityHomePosts() {
  const [data, setData] = useState<getResponse | null>(null);
  const [page, setPage] = useState(1);
  const [existNextPage, setENP] = useState(false);
  const [loading, setLoading] = useState(false);

  const getItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://3.35.87.48:3000/board?page=${page}&size=20&order=DESC&category=free`
      );
      setData(
        (prevData) =>
          ({
            result: {
              items: [
                ...(prevData?.result.items || []),
                ...response.data.result.items,
              ],
              existsNextPage: response.data.result.existsNextPage,
            },
          } as getResponse)
      );
      setENP(response.data?.result.existsNextPage);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    getItems();
  }, []);

  const handleMoreClick = () => {
    getItems();
  };

  if (data !== null && data.result.items) {
    const itemlist: Post[] = data.result.items.map((item) => ({
      idx: item.idx,
      view: item.view,
      userIdx: item.userIdx,
      title: item.title,
      category: item.category,
      description: item.description,
      writeDate: new Date(item.writeDate),
      coverImage: item.images[0]?.coverImgPath || "",
    }));

    return (
      <section>
        <PC>
          <h2 className="text-2xl font-bold p-10">분양글</h2>
        </PC>
        <Mobile>
          <h2 className="text-xl font-bold pl-12 pt-4 pb-4">분양글</h2>
        </Mobile>
        <ul className="pl-10 pr-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {itemlist.map((post) => (
            <li key={post.userIdx}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
        {existNextPage && (
          <button
            className="my-4 mx-auto block px-40 text-base tracking-[-.16px] h-11 bg-main-color text-white rounded-lg font-bold border border-transparent group hover:border-2 hover:bg-white hover:text-main-color hover:border-main-color"
            onClick={handleMoreClick}
            disabled={loading}
          >
            {loading ? "로딩 중..." : "더보기"}
          </button>
        )}
      </section>
    );
  } else {
    return <div>Loading...</div>;
  }
}
