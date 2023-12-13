"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useCallback, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import VideoPlayer from "@/components/action/video-player";
import StreamingChatView from "@/components/action/StreamingChatView";

import Image from "next/image";
import unlike_black from "../../../../../../public/img/unlike_black.png";
import like_maincolor from "../../../../../../public/img/like_maincolor.png";
import { getActionInfo } from "@/service/httpconnect/live_stream_axios";
import acitonLiveDto from "@/service/dto/action-live-dto";
import { GetAuctionPostsView } from "@/service/my/auction";
import axios from "axios";

import {
  auctionDeleteBookmark,
  auctionRegisterBookmark,
} from "@/api/auction/auction";

type Props = {
  params: {
    slug: string;
  };
};

export default function ActionPage({ params: { slug } }: Props) {
  const router = useRouter();
  const params = useParams();
  const idx = params?.idx;

  let data: acitonLiveDto;
  // const [menu, setMenu] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [actionTitle, setActionTitle] = useState("");
  const [profilePath, setProfilePath] = useState("");
  const [nickname, setNickname] = useState("");
  const [description, setDescription] = useState("");
  const [streamKey, setStreamKey] = useState("");

  const [bookmarkCnt, setBookmarkCnt] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  const [postsData, setPostsData] = useState<GetAuctionPostsView | null>(null);
  const [accessToken, setAccessToken] = useState("");
  const [userIdx, setUserIdx] = useState<number>(0); // 로그인 한 유저의 userIdx 저장

  useEffect(() => {
    const storedData = localStorage.getItem("recoil-persist");
    if (storedData) {
      const userData = JSON.parse(storedData);
      if (userData.USER_DATA.accessToken) {
        const extractedAccessToken = userData.USER_DATA.accessToken;
        setAccessToken(extractedAccessToken);
        setUserIdx(userData.USER_DATA.idx);
      } else {
      }
    }
  }, []);

  const getData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/board/${idx}?userIdx=`
      );
      // Assuming your response data has a 'result' property
      console.log(response.data);
      setPostsData(response.data);
      if (response.data && response.data.result) {
        setActionTitle(response.data.result.title);
        setDescription(response.data.result.description);
        if (response.data.result.UserInfo) {
          setNickname(response.data.result.UserInfo.nickname);
          setProfilePath(response.data.result.UserInfo.profilePath);
        }
        if (response.data.result.boardAuction) {
          setStreamKey(response.data.result.boardAuction.streamKey);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  /*********************
   *
   *       북마크
   *
   ********************/
  const bookmarkClick = () => {
    if (bookmarked) {
      setBookmarked(false);
      setBookmarkCnt(bookmarkCnt - 1);
      auctionDeleteMutation.mutate({
        userAccessToken: accessToken,
        boardIdx: postsData!.result.boardAuction.boardIdx,
      });
    } else {
      setBookmarked(true);
      setBookmarkCnt(bookmarkCnt + 1);
      auctionRegisterMutation.mutate({
        userAccessToken: accessToken,
        boardIdx: postsData!.result.boardAuction.boardIdx,
        userIdx: userIdx,
      });
    }
  };
  // 북마크 등록
  const auctionRegisterMutation = useMutation({
    mutationFn: auctionRegisterBookmark,
    onSuccess: (data) => {
      console.log("===auctionRegisterMutation====");
      console.log(data);
      console.log("==============================");
    },
  });
  // 북마크 삭제
  const auctionDeleteMutation = useMutation({
    mutationFn: auctionDeleteBookmark,
    onSuccess: (data) => {
      console.log("===auctionDeleteMutation====");
      console.log(data);
      console.log("============================");
    },
  });

  useEffect(() => {
    if (streamKey != "") {
      console.log(streamKey);
      setVideoUrl(
        `https://live.reptimate.store/stream/hls/${streamKey}/index.m3u8`
      );
    }
  }, [streamKey]);

  useEffect(() => {
    getData();
    //서버 사이드 렌더링으로 데이터 가져오기
    getActionInfo(callback);

    // let mounted = true
    // console.log('마운트 될 때만 실행된다.');

    // if (mounted) {

    // }

    // return () => {
    //     console.log('컴포넌트가 화면에서 사라짐');
    // };
  }, []);

  //데이터 받아오는 부분
  function callback(message: acitonLiveDto): void {
    // console.log("message");
    // console.log(message);
    ///data = message;
    // setActionTitle(message.title);
    // setDescription(message.description);
    // setNickname(message.UserInfo.nickname);
    // setProfilePath(message.UserInfo.profilePath);
    // if (message.liveStream.state == 1) {
    //   setVideoUrl(
    //     `https://live.reptimate.store/stream/hls/${streamKey}/index.m3u8`
    //   );
    // }
  }

  return (
    <>
      {/* <Script
                src="../../../js/demo.js"
                strategy="lazyOnload"
                onLoad={() =>
                    console.log(`script loaded correctly, window.FB has been populated`)
                }
            /> */}
      <div className="flex flex-col lg:flex-row lg:mt-36 md:mt-36 max-[768px]:mt-[50px]">
        <div className="flex-auto flex-col lg:w-[70%]">
          <div className="bg-black w-full">
            <VideoPlayer src={videoUrl}></VideoPlayer>
          </div>

          <div className="flex h-[8rem] flex-col py-4 px-6 text-black border-b-[1px] border-gray">
            <span className="basis-1/2 text-left text-lg">{actionTitle}</span>
            <div className="flex text-left basis-1/2">
              <div className="flex items-center my-2 relative basis-1/2">
                <img
                  className="w-10 h-10 rounded-full border-2 cursor-pointer mr-1"
                  src={profilePath || "/img/reptimate_logo.png"}
                  alt=""
                />
                <p className="text-lg font-bold">{nickname}</p>
              </div>

              <div className="flex basis-1/2 flex-row-reverse text-center">
                {bookmarked ? (
                  <a onClick={bookmarkClick}>
                    <Image
                      src={like_maincolor}
                      width={20}
                      height={20}
                      alt="북마크"
                      className="like_btn m-auto mr-1"
                    />
                  </a>
                ) : (
                  <a onClick={bookmarkClick}>
                    <Image
                      src={unlike_black}
                      width={20}
                      height={20}
                      alt="북마크"
                      className="like_btn m-auto mr-1"
                    />
                  </a>
                )}
                <p className="text-lg font-semibold mr-2">{bookmarkCnt}</p>
              </div>
            </div>
          </div>

          <div className="p-4 text-start border-gray">
            <div className="overflow-y-auto rounded-lg bg-silver p-4">
              {description}
            </div>
          </div>
        </div>
        <div className="lg:w-[30%]">
          <StreamingChatView></StreamingChatView>
        </div>
      </div>
    </>
  );
}
