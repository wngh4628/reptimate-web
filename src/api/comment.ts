import instance from "@/api/index";

export const commentWrtie = async ({
  boardIdx,
  category,
  description,
  userAccessToken,
}: {
  boardIdx: number;
  category: string;
  description: string;
  userAccessToken: string;
}) => {
  const data = {
    boardIdx: boardIdx,
    category: category,
    description: description,
  };

  const headers = {
    Authorization: `Bearer ${userAccessToken}`,
    "Content-Type": "application/json",
  };

  const result = await instance.post(`/board/comment`, data, {
    headers,
  });

  return result;
};

export const commentDelete = async ({
  boardIdx,
  category,
  commentIdx,
  userAccessToken,
}: {
  boardIdx: number;
  category: string;
  commentIdx: number;
  userAccessToken: string;
}) => {
  const headers = {
    Authorization: `Bearer ${userAccessToken}`,
    "Content-Type": "application/json",
  };

  try {
    const result = await instance.delete(`/board/comment/${commentIdx}`, {
      headers,
      params: {
        boardIdx,
        category,
      },
    });

    return result;
  } catch (error) {
    // Handle errors here
    throw error;
  }
};

export const commentEdit = async ({
  boardIdx,
  category,
  commentIdx,
  description,
  userAccessToken,
}: {
  boardIdx: number;
  category: string;
  commentIdx: number;
  description: string;
  userAccessToken: string;
}) => {
  const data = {
    boardIdx: boardIdx,
    category: category,
    commentIdx: commentIdx,
    description: description,
  };

  const headers = {
    Authorization: `Bearer ${userAccessToken}`,
    "Content-Type": "application/json",
  };

  const result = await instance.patch(`/board/comment/${commentIdx}`, data, {
    headers,
  });

  return result;
};

export const replyWrite = async ({
  boardIdx,
  category,
  commentIdx,
  description,
  userAccessToken,
}: {
  boardIdx: number;
  category: string;
  commentIdx: number;
  description: string;
  userAccessToken: string;
}) => {
  const data = {
    boardIdx: boardIdx,
    category: category,
    commentIdx: commentIdx,
    description: description,
  };

  const headers = {
    Authorization: `Bearer ${userAccessToken}`,
    "Content-Type": "application/json",
  };

  const result = await instance.post(`/board/comment`, data, {
    headers,
  });

  return result;
};
