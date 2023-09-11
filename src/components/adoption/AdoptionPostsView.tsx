import { GetAdoptionPostsView, Images, getResponse } from "@/service/adoption";
import axios from "axios";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import VideoPlayer from "../VideoPlayer";
import { Mobile, PC } from "../ResponsiveLayout";
import ImageSlider from "./ImageSlider";

export default function AdoptionPostsView() {
  const params = useParams();
  const idx = params?.idx;

  const [data, setData] = useState<GetAdoptionPostsView | null>(null);

  const getData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.reptimate.store/board/${idx}?userIdx=1`
      );
      // Assuming your response data has a 'result' property
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [idx]);

  useEffect(() => {
    getData();
  }, []);

  const post = data?.result;

  const date = new Date(post?.writeDate || "");

  const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero if needed
  const day = date.getDate().toString().padStart(2, "0"); // Add leading zero if needed
  const hours = date.getUTCHours().toString().padStart(2, "0"); // Get hours and add leading zero if needed
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  const postWriteDate = `${year}.${month}.${day}`;
  const postWriteTime = `${hours}:${minutes}`;

  if (post !== null && post?.images) {
    const itemlist: Images[] = post.images.map((item) => ({
      idx: item.idx,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      boardIdx: item.boardIdx,
      category: item.category,
      path: item.path,
    }));

    return (
      <div>
        {/* Render data if it exists */}
        {post && (
          <div className="max-w-screen-sm mx-auto">
            <PC>
              <h2 className="text-3xl font-bold pt-10">{post.title}</h2>
              <div className="flex items-center my-2">
                <img
                  className="w-10 h-10 rounded-full border-2"
                  src={post.UserInfo.profilePath || "/img/reptimate_logo.png"}
                  alt=""
                />
                <p className="font-bold ml-1">{post.UserInfo.nickname}</p>
                <p className="ml-2 text-gray-500">{postWriteDate}</p>
                <p className="ml-1 text-gray-500">{postWriteTime}</p>
              </div>
              <ImageSlider imageUrls={itemlist} />
              <div className="flex flex-row items-center py-3">
                <p className="text-lg font-semibold ml-5">판매가격</p>
                <p className="text-xl font-bold ml-auto mr-5">
                  {post.boardCommercial.price}원
                </p>
              </div>
              <div className="flex flex-row items-center justify-center">
                <div className="w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 text-lg font-bold">품종</p>
                  <p className="pb-1 text-lg">{post.boardCommercial.variety}</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 text-lg font-bold">성별</p>
                  <p className="pb-1 text-lg">{post.boardCommercial.gender}</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 text-lg font-bold">크기</p>
                  <p className="pb-1 text-lg">{post.boardCommercial.size}</p>
                </div>
              </div>
              <p className="text-lg my-7">{post.description}</p>
            </PC>
            <Mobile>
              <h2 className="text-xl font-bold pl-12 pt-4 pb-4">
                {post.title}
              </h2>
            </Mobile>
          </div>
        )}
      </div>
    );
  }
}
