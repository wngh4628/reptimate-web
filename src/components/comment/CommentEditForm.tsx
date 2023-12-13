import React, { ChangeEvent, useState } from "react";

type CommentFormProps = {
  value: string;
  onSubmit: (comment: string) => void;
  onChange: (value: string) => void;
};

const CommentEditForm: React.FC<CommentFormProps> = ({ value, onSubmit }) => {
  const [comment, setComment] = useState<string>(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() !== "") {
      onSubmit(comment);
    }
  };
  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 500) {
      setComment(inputValue);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex w-full">
          <textarea
            id="comment"
            name="comment"
            placeholder="댓글을 남겨보세요."
            value={comment}
            className="flex-grow border-2 border-gray-400 p-3 rounded-md resize-none"
            rows={1}
            onChange={handleCommentChange}
          />
          <button
            type="submit"
            className={`flex items-center cursor-pointer text-center bg-main-color text-white font-bold rounded-md p-3 px-5 ml-0.5 ${comment ? "opacity-100" : "opacity-50 pointer-events-none"
              }`}
            disabled={!comment}
          >
            수정
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentEditForm;
