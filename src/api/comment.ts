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
