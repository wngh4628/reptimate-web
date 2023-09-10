import { Comment } from "@/service/comment";
import { Mobile, PC } from "./ResponsiveLayout";
import { useState } from "react";
import ReplyForm from "./ReplyForm";

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
  if (typeof window !== "undefined") {
    // Check if running on the client side
    const storedData = localStorage.getItem("recoil-persist");
    const userData = JSON.parse(storedData || "");
    currentUserIdx = userData.USER_DATA.idx;
    userAccessToken = userData.USER_DATA.accessToken;
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

  const [isReplying, setIsReplying] = useState(false);
  const [commentFormValue, setCommentFormValue] = useState<string>("");

  const handleReplyClick = () => {
    // 답글 달기 버튼을 클릭했을 때 댓글 창을 토글
    setIsReplying((prevIsReplying) => !prevIsReplying);
  };

  const handleCommentSubmit = (replyData: string) => {
    const requestData = {
      boardIdx: idx,
      category: "reply",
      description: replyData,
      userAccessToken: userAccessToken || "",
    };

    if (replyData !== "") {
      // mutation.mutate(requestData);

      setCommentFormValue(""); // 댓글 폼 초기화
      // 댓글 리스트 다시 로딩을 위해 페이지 및 관련 상태 변수를 초기화합니다.
      // setPage(1);
      // setENP(false);
      // setCommentData(null);
    } else {
      // Create the alert message based on missing fields
      let alertMessage = "오류입니다. :\n 다시 시도해주세요.";

      alert(alertMessage);
    }
  };

  return (
    <div>
      <div className="mx-1 mt-2 mb-6 flex flex-col">
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full border-2"
            src={profilePath || "/img/reptimate_logo.png"}
            alt=""
          />
          <p className="text-xl font-bold ml-1">{nickname}</p>
        </div>
        <p className="ml-10">{description}</p>
        <div className="flex items-center my-1 text-sm ml-10">
          <p className="text-gray-500">{postWriteDate}</p>
          <p className="ml-1 text-gray-500">{postWriteTime}</p>
          <p
            className="ml-2 text-gray-500 cursor-pointer"
            onClick={handleReplyClick}
          >
            답글 달기
          </p>
          {isCurrentUserComment && (
            <>
              <p className="ml-2 text-gray-500 cursor-pointer">수정</p>
              <p className="ml-2 text-gray-500 cursor-pointer">삭제</p>
            </>
          )}
        </div>
        {isReplying && (
          <div className="ml-10 my-2">
            <ReplyForm
              value={commentFormValue} // 전달할 댓글 폼의 값을 설정합니다.
              onSubmit={handleCommentSubmit}
              onChange={(value: string) => setCommentFormValue(value)} // 댓글 폼 값이 변경될 때마다 업데이트합니다.
            />
          </div>
        )}
      </div>
    </div>
  );
}
