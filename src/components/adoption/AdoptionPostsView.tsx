import {
  GetAdoptionPostsView,
  Images,
  getResponse,
} from "@/service/my/adoption";
import axios from "axios";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Mobile, PC } from "../ResponsiveLayout";
import ImageSlider from "./ImageSlider";
import { useMutation } from "@tanstack/react-query";
import { commentWrtie } from "@/api/comment";
import { useRecoilValue } from "recoil";
import { userAtom, userInfoState } from "@/recoil/user";
import { Comment, getCommentResponse } from "@/service/comment";
import CommentCard from "../comment/CommentCard";
import CommentForm from "../comment/CommentForm";

export default function AdoptionPostsView() {
  const params = useParams();
  const idx = params?.idx;

  const [data, setData] = useState<GetAdoptionPostsView | null>(null);

  const [commentData, setCommentData] = useState<getCommentResponse | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [existNextPage, setENP] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLogin = useRecoilValue(userAtom);
  const target = useRef(null);

  const [commentFormValue, setCommentFormValue] = useState<string>(""); // 댓글 작성 후, 댓글 폼 불러오기 위한 변수

  const [commentList, setCommentList] = useState<Comment[]>();

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  };

  const handleEdit = () => {
    // Implement the edit action here
  };

  const handleDelete = () => {
    // Implement the delete action here
  };

  const handleReport = () => {
    // Implement the report action here
  };

  const userInfo = useRecoilValue(userInfoState);

  let userAccessToken: string | null = null;
  let currentUserIdx = userInfo.idx;
  let userProfilePath = userInfo.profilePath;
  let userNickname = userInfo.nickname;
  console.log(userInfo.nickname);
  if (typeof window !== "undefined") {
    // Check if running on the client side
    const storedData = localStorage.getItem("recoil-persist");
    const userData = JSON.parse(storedData || "");
    userAccessToken = userData.USER_DATA.accessToken;
  }

  const options = {
    threshold: 1.0,
  };

  const getData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.reptimate.store/board/${idx}?userIdx=${currentUserIdx}`
      );
      // Assuming your response data has a 'result' property
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

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

  const getCommentData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.reptimate.store/board/${idx}/comment?page=${page}&size=20&order=DESC`
      );
      setCommentData(
        (prevData) =>
          ({
            result: {
              items: [
                ...(prevData?.result.items || []),
                ...response.data.result.items,
              ],
              existsNextPage: response.data.result.existsNextPage,
            },
          } as getCommentResponse)
      );
      setENP(response.data?.result.existsNextPage);
      setPage((prevPage) => prevPage + 1);

      // 댓글 데이터를 받은 후에 댓글 리스트를 업데이트
      const newComments = response.data.result.items.map((item: any) => ({
        idx: item.idx,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt,
        userIdx: item.UserInfo.idx,
        boardIdx: item.boardIdx,
        boardState: item.boardState,
        filePath: item.filePath,
        description: item.description,
        replyCnt: item.replyCnt,
        nickname: item.UserInfo.nickname,
        profilePath: item.UserInfo.profilePath,
      }));
      setCommentList((prevCommentList) => [
        ...(prevCommentList || []),
        ...newComments,
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    getCommentData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loading && existNextPage) {
          getCommentData();
        }
      });
    }, options);

    if (target.current) {
      observer.observe(target.current);
    }

    return () => {
      if (target.current) {
        observer.unobserve(target.current);
      }
    };
  }, [getCommentData, existNextPage, loading, options]);

  //댓글 작성 성공 시,
  const mutation = useMutation({
    mutationFn: commentWrtie,
    onSuccess: (data) => {
      console.log("============================");
      console.log("Successful writing of comment!");
      console.log(data);
      console.log(data.data);
      console.log("============================");
      const newComment: Comment = {
        idx: data.data.result.idx,
        createdAt: data.data.result.createdAt,
        updatedAt: data.data.result.updatedAt,
        deletedAt: data.data.result.deletedAt,
        userIdx: data.data.result.userIdx,
        boardIdx: data.data.result.boardIdx,
        boardState: data.data.result.boardState,
        filePath: null,
        description: data.data.result.description,
        replyCnt: data.data.result.replyCnt,
        nickname: userNickname || "",
        profilePath: userProfilePath || "",
      };
      setCommentList((prevCommentList) => [
        newComment,
        ...(prevCommentList || []),
      ]);
    },
  });

  if (post !== null && post?.images) {
    const itemlist: Images[] = post.images.map((item) => ({
      idx: item.idx,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      boardIdx: item.boardIdx,
      category: item.category,
      path: item.path,
    }));

    //댓글 작성 버튼 클릭 시
    const handleCommentSubmit = (comment: string) => {
      const requestData = {
        boardIdx: post.idx,
        category: "comment",
        description: comment,
        userAccessToken: userAccessToken || "",
      };

      if (comment !== "") {
        mutation.mutate(requestData);

        setCommentFormValue(""); // 댓글 폼 초기화
        // 댓글 리스트 다시 로딩을 위해 페이지 및 관련 상태 변수를 초기화합니다.
        setPage(1);
        setENP(false);
        setCommentData(null);
      } else {
        // Create the alert message based on missing fields
        let alertMessage = "오류입니다. :\n 다시 시도해주세요.";

        alert(alertMessage);
      }
    };

    return (
      <div>
        {post && (
          <div className="max-w-screen-sm mx-auto">
            <PC>
              <h2 className="text-4xl font-bold pt-10">{post.title}</h2>
              <div className="flex items-center my-2">
                <img
                  className="w-10 h-10 rounded-full border-2"
                  src={post.UserInfo.profilePath || "/img/reptimate_logo.png"}
                  alt=""
                />
                <p className="text-xl font-bold ml-1">
                  {post.UserInfo.nickname}
                </p>
                <p className="ml-2 text-gray-500">{postWriteDate}</p>
                <p className="ml-1 text-gray-500">{postWriteTime}</p>
                <p className="ml-2 text-gray-500">조회 {post.view}</p>
                <div className="relative ml-auto">
                  <button
                    onClick={toggleMenu}
                    className="text-gray-500 cursor-pointer text-xl"
                  >
                    ⁝
                  </button>
                  {menuOpen && (
                    <div className="flex items-center justify-center absolute right-0 mt-1 w-20 bg-white border border-gray-200 shadow-lg rounded z-50">
                      <ul>
                        <li
                          onClick={() => {
                            handleEdit();
                            toggleMenu();
                          }}
                          className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                        >
                          수정
                        </li>
                        <li
                          onClick={() => {
                            handleDelete();
                            toggleMenu();
                          }}
                          className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                        >
                          삭제
                        </li>
                        <li
                          onClick={() => {
                            handleReport();
                            toggleMenu();
                          }}
                          className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                        >
                          신고
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <ImageSlider imageUrls={itemlist} />
              <div className="flex flex-row items-center py-3">
                <p className="text-lg font-semibold ml-5">판매가격</p>
                <p className="text-xl font-bold ml-auto mr-5">
                  {post.boardCommercial.price.toLocaleString()}원
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
              <hr className="border-t border-gray-300 my-1" />
              <div className="flex flex-row items-center py-3">
                <p className="text-lg font-semibold ml-3 mr-2">댓글</p>
                <p className="text-xl font-bold text-gender-none-color">&gt;</p>
              </div>
              <div>
                <CommentForm
                  value={commentFormValue} // 전달할 댓글 폼의 값을 설정합니다.
                  onSubmit={handleCommentSubmit}
                  onChange={(value: string) => setCommentFormValue(value)} // 댓글 폼 값이 변경될 때마다 업데이트합니다.
                />
              </div>
            </PC>
            <Mobile>
              <div className="mx-2">
                <h2 className="text-2xl font-bold pt-10">{post.title}</h2>
                <div className="flex items-center my-2">
                  <img
                    className="w-7 h-7 rounded-full border-2"
                    src={post.UserInfo.profilePath || "/img/reptimate_logo.png"}
                    alt=""
                  />
                  <p className="text-lg font-bold">{post.UserInfo.nickname}</p>
                  <p className="ml-2 text-gray-500 text-sm">{postWriteDate}</p>
                  <p className="ml-1 text-gray-500 text-sm">{postWriteTime}</p>
                  <p className="ml-2 text-gray-500 text-sm">조회 {post.view}</p>
                  <div className="relative ml-auto">
                    <button
                      onClick={toggleMenu}
                      className="text-gray-500 cursor-pointer text-xl"
                    >
                      ⁝
                    </button>
                    {menuOpen && (
                      <div className="flex items-center justify-center absolute right-0 mt-1 w-20 bg-white border border-gray-200 shadow-lg rounded z-50">
                        <ul>
                          <li
                            onClick={() => {
                              handleEdit();
                              toggleMenu();
                            }}
                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                          >
                            수정
                          </li>
                          <li
                            onClick={() => {
                              handleDelete();
                              toggleMenu();
                            }}
                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                          >
                            삭제
                          </li>
                          <li
                            onClick={() => {
                              handleReport();
                              toggleMenu();
                            }}
                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                          >
                            신고
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <ImageSlider imageUrls={itemlist} />
                <div className="flex flex-row items-center py-1">
                  <p className="font-semibold ml-2">판매가격</p>
                  <p className="font-bold ml-auto mr-2">
                    {post.boardCommercial.price.toLocaleString()}원
                  </p>
                </div>
                <div className="flex flex-row items-center justify-center">
                  <div className="w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                    <p className="pt-1 font-bold">품종</p>
                    <p className="pb-1 text-sm">
                      {post.boardCommercial.variety}
                    </p>
                  </div>
                  <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                    <p className="pt-1 font-bold">성별</p>
                    <p className="pb-1 text-sm">
                      {post.boardCommercial.gender}
                    </p>
                  </div>
                  <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                    <p className="pt-1 font-bold">크기</p>
                    <p className="pb-1 text-sm">{post.boardCommercial.size}</p>
                  </div>
                </div>
                <p className="my-4">{post.description}</p>
                <hr className="border-t border-gray-300" />
                <div className="flex flex-row items-center py-2">
                  <p className="font-semibold ml-1 mr-1">댓글</p>
                  <p className="text-lg font-bold text-gender-none-color">
                    &gt;
                  </p>
                </div>
                <div>
                  <CommentForm
                    value={commentFormValue} // 전달할 댓글 폼의 값을 설정합니다.
                    onSubmit={handleCommentSubmit}
                    onChange={(value: string) => setCommentFormValue(value)} // 댓글 폼 값이 변경될 때마다 업데이트합니다.
                  />
                </div>
              </div>
            </Mobile>
            <ul className="mt-6">
              {commentList !== null && commentList ? (
                commentList.map((comment) => (
                  <li key={comment.idx}>
                    <CommentCard comment={comment} />
                  </li>
                ))
              ) : (
                <li></li>
              )}
            </ul>
            {existNextPage && (
              <div className="flex justify-center">
                <div
                  className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"
                  ref={target}
                ></div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
