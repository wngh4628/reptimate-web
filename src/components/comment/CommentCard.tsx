import { Comment, getCommentResponse } from "@/service/comment";
import { Mobile, PC } from "../ResponsiveLayout";
import { useCallback, useEffect, useState } from "react";
import ReplyForm from "./ReplyForm";
import { useMutation } from "@tanstack/react-query";
import { commentDelete, commentEdit, replyWrite } from "@/api/comment";
import CommentEditForm from "./CommentEditForm";
import axios from "axios";
import ReplyCard from "./ReplyCard";

type Props = { comment: Comment };
export default function CommentCard({
  comment: {
    idx,
    createdAt,
    updatedAt,
    deletedAt,
    userIdx,
    boardIdx,
    boardState,
    filePath,
    description,
    replyCnt,
    nickname,
    profilePath,
  },
}: Props) {
  let userAccessToken: string | null = null;
  let currentUserIdx: number | null = null;
  let userProfilePath: string | null = null;
  let userNickname: string | null = null;
  if (typeof window !== "undefined") {
    // Check if running on the client side
    const storedData = localStorage.getItem("recoil-persist");
    if (storedData != null) {
      const userData = JSON.parse(storedData || "");
      currentUserIdx = userData.USER_DATA.idx;
      userAccessToken = userData.USER_DATA.accessToken;
      userProfilePath = userData.USER_DATA.profilePath;
      userNickname = userData.USER_DATA.nickname;
    }
  }

  const [replyData, setReplyData] = useState<getCommentResponse | null>(null);
  const [page, setPage] = useState(1);
  const [existNextPage, setENP] = useState(false);
  const [loading, setLoading] = useState(false);

  const date = new Date(createdAt || "");

  const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero if needed
  const day = date.getDate().toString().padStart(2, "0"); // Add leading zero if needed
  const hours = date.getUTCHours().toString().padStart(2, "0"); // Get hours and add leading zero if needed
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  const postWriteDate = `${year}.${month}.${day}`;
  const postWriteTime = `${hours}:${minutes}`;

  const isCurrentUserComment = currentUserIdx === userIdx;

  const [isReplyWrtie, setIsReplyWrtie] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [commentFormValue, setCommentFormValue] = useState<string>("");

  const [isDeleted, setIsDeleted] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(description);

  const [replyList, setReplyList] = useState<Comment[]>();

  const getReplyData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.reptimate.store/board/${idx}/reply?page=${page}&size=20&order=DESC`
      );
      setReplyData(
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    getReplyData();
  }, []);

  useEffect(() => {
    if (replyData !== null && replyData.result.items) {
      setReplyList(
        replyData.result.items.map((item) => ({
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
        }))
      );
    } else {
      setReplyList([]);
    }
  }, [replyData]);

  const handleReplyWriteClick = () => {
    setIsReplyWrtie((prevIsReplyWrtie) => !prevIsReplyWrtie);
  };

  const handleReplyClick = () => {
    setIsReplying((prevIsReplying) => !prevIsReplying);
  };

  const replyMutation = useMutation({
    mutationFn: replyWrite,
    onSuccess: (data) => {
      console.log("============================");
      console.log("Successful Creating of reply!");
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
      setReplyList((prevReplyList) => [newComment, ...(prevReplyList || [])]);
      setIsReplyWrtie((prevIsReplyWrtie) => !prevIsReplyWrtie);
    },
  });

  const handleCommentSubmit = (replyData: string) => {
    const requestData = {
      boardIdx: boardIdx,
      category: "reply",
      commentIdx: idx,
      description: replyData,
      userAccessToken: userAccessToken || "",
    };

    if (replyData !== "") {
      replyMutation.mutate(requestData);
    } else {
      // Create the alert message based on missing fields
      let alertMessage = "오류입니다. :\n 다시 시도해주세요.";

      alert(alertMessage);
    }
  };

  const mutation = useMutation({
    mutationFn: commentDelete,
    onSuccess: (data) => {
      console.log("============================");
      console.log("Successful Deleting of comment!");
      console.log(data);
      console.log(data.data);
      console.log("============================");
      setIsDeleted(true);
      // alert("댓글이 삭제되었습니다.");
    },
  });

  const handleDeleteClick = () => {
    // Display a confirmation message using the alert method
    const confirmation = window.confirm("댓글을 삭제하시겠습니까?");

    if (confirmation) {
      const requestData = {
        boardIdx: boardIdx,
        category: "comment",
        commentIdx: idx,
        userAccessToken: userAccessToken || "",
      };

      mutation.mutate(requestData);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const CancleEdit = () => {
    setIsEditing(false);
  };

  const editMutation = useMutation({
    mutationFn: commentEdit,
    onSuccess: (data) => {
      console.log("============================");
      console.log("Successful Deleting of comment!");
      console.log(data);
      console.log(data.data.result.description);
      console.log("============================");
      setEditedComment(data.data.result.description);
      setIsEditing(false);
    },
  });

  const handleEditCommentSubmit = (editComment: string) => {
    const requestData = {
      boardIdx: boardIdx,
      category: "comment",
      commentIdx: idx,
      description: editComment,
      userAccessToken: userAccessToken || "",
    };

    editMutation.mutate(requestData);
  };

  //답글 수정 상태 업데이트
  const handleEditReply = (replyIdx: number, description: string) => {
    const updatedReplyList = replyList?.map((reply) => {
      if (reply.idx === replyIdx) {
        // If the reply idx matches the one being edited, update the description
        return { ...reply, description: description };
      }
      return reply; // For other replies, return them unchanged
    });

    // Update the state with the new replyList
    setReplyList(updatedReplyList);
  };

  //답글 삭제 상태 업데이트
  const handleDeleteReply = (replyIdx: number) => {
    setReplyList((prevReplyList) =>
      prevReplyList?.filter((reply) => reply.idx !== replyIdx)
    );
    console.log(replyList);
  };

  return (
    <div>
      {isDeleted ? null : (
        <div className="mx-1 mt-2 mb-6 flex flex-col">
          <div className="flex items-center">
            <img
              className="w-10 h-10 rounded-full border-2"
              src={profilePath || "/img/reptimate_logo.png"}
              alt=""
            />
            <p className="text-xl font-bold ml-1">{nickname}</p>
          </div>
          {isEditing ? (
            <div className="ml-10">
              <CommentEditForm
                value={editedComment} // 전달할 댓글 폼의 값을 설정합니다.
                onSubmit={handleEditCommentSubmit}
                onChange={(value: string) => setEditedComment(value)} // 댓글 폼 값이 변경될 때마다 업데이트합니다.
              />
              <p
                className="cursor-pointer text-xs font-bold text-gray-500 ml-1 mt-1"
                onClick={CancleEdit}
              >
                취소
              </p>
            </div>
          ) : (
            <div>
              <p className="ml-10">{editedComment}</p>
              <div className="flex items-center my-1 text-sm ml-10">
                <p className="text-gray-500">{postWriteDate}</p>
                <p className="ml-1 text-gray-500">{postWriteTime}</p>
                {userAccessToken && (
                  <p
                    className="ml-2 text-gray-500 cursor-pointer"
                    onClick={handleReplyWriteClick}
                  >
                    답글 달기
                  </p>
                )}
                {isCurrentUserComment && (
                  <>
                    <p
                      className="ml-2 text-gray-500 cursor-pointer"
                      onClick={handleEditClick}
                    >
                      수정
                    </p>
                    <p
                      className="ml-2 text-gray-500 cursor-pointer"
                      onClick={handleDeleteClick}
                    >
                      삭제
                    </p>
                  </>
                )}
              </div>
              {isReplyWrtie && (
                <div className="ml-10 -2">
                  {!isEditing ? (
                    <ReplyForm
                      value={commentFormValue} // 전달할 댓글 폼의 값을 설정합니다.
                      onSubmit={handleCommentSubmit}
                      onChange={(value: string) => setCommentFormValue(value)} // 댓글 폼 값이 변경될 때마다 업데이트합니다.
                    />
                  ) : (
                    <></>
                  )}
                </div>
              )}
              {replyList && replyList.length > 0 && (
                <p
                  className="ml-10 text-sm text-gray-500 cursor-pointer"
                  onClick={handleReplyClick}
                >
                  ㅡ 답글 {replyList?.length}개
                </p>
              )}
            </div>
          )}
          {isReplying && (
            <div className="ml-10 my-2">
              <ul>
                {replyList !== null && replyList ? (
                  replyList.map((reply) => (
                    <li key={reply.idx}>
                      <ReplyCard
                        comment={reply}
                        onEdit={handleEditReply}
                        onDelete={handleDeleteReply}
                      />
                    </li>
                  ))
                ) : (
                  <li></li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
