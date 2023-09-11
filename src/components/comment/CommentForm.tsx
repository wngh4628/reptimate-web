import React, { useState } from "react";

type CommentFormProps = {
  value: string;
  onSubmit: (comment: string) => void;
  onChange: (value: string) => void;
};

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [comment, setComment] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() !== "") {
      onSubmit(comment);
      setComment("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex w-full">
          <input
            id="comment"
            name="comment"
            placeholder="댓글을 남겨보세요."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-grow border-2 border-gray-400 p-3 rounded-md"
          />
          <button
            type="submit"
            className={`flex items-center cursor-pointer text-center bg-main-color text-white font-bold rounded-md p-3 px-5 ml-0.5 ${
              comment ? "opacity-100" : "opacity-50 pointer-events-none"
            }`}
            disabled={!comment}
          >
            입력
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
