import { Comment } from "@/service/comment";
import { Mobile, PC } from "../ResponsiveLayout";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { commentDelete, commentEdit } from "@/api/comment";
import CommentEditForm from "./CommentEditForm";

type Props = {
  comment: Comment;
  onEdit: (idx: number, description: string) => void; // Define the onDelete prop
  onDelete: (idx: number) => void; // Define the onDelete prop
};
export default function ReplyCard({
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
  onEdit,
  onDelete,
}: Props) {
  let userAccessToken: string | null = null;
  let currentUserIdx: number | null = null;
  if (typeof window !== "undefined") {
    // Check if running on the client side
    const storedData = localStorage.getItem("recoil-persist");
    if (storedData != null) {
      const userData = JSON.parse(storedData || "");
      currentUserIdx = userData.USER_DATA.idx;
      userAccessToken = userData.USER_DATA.accessToken;
    }
  }

  const date = new Date(createdAt || "");

  const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero if needed
  const day = date.getDate().toString().padStart(2, "0"); // Add leading zero if needed
  const hours = date.getUTCHours().toString().padStart(2, "0"); // Get hours and add leading zero if needed
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  const postWriteDate = `${year}.${month}.${day}`;
  const postWriteTime = `${hours}:${minutes}`;

  const isCurrentUserComment = currentUserIdx === userIdx;

  const [isDeleted, setIsDeleted] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(description);

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
      onDelete(idx);
    },
  });

  const handleDeleteClick = () => {
    // Display a confirmation message using the alert method
    const confirmation = window.confirm("댓글을 삭제하시겠습니까?");

    if (confirmation) {
      const requestData = {
        boardIdx: boardIdx,
        category: "reply",
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
      onEdit(idx, data.data.result.description);
    },
  });

  const handleEditCommentSubmit = (editComment: string) => {
    const requestData = {
      boardIdx: boardIdx,
      category: "reply",
      commentIdx: idx,
      description: editComment,
      userAccessToken: userAccessToken || "",
    };

    editMutation.mutate(requestData);
  };

  return (
    <div className="overflow-x-hidden">
      {isDeleted ? null : (
        <div className="mx-1 mt-2 mb-2 flex flex-col break-all">
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
