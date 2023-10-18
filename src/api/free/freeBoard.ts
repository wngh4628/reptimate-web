import instance from "@/api/index";

export const freeWrite = async ({
  userIdx,
  title,
  category,
  description,
  userAccessToken,
  fileUrl,
}: {
  userIdx: string;
  title: string;
  category: string;
  description: string;
  userAccessToken: string;
  fileUrl: String;
}) => {
  const data = {
    userIdx: userIdx,
    title: title,
    category: category,
    description: description,
    fileUrl: fileUrl,
  };

  const headers = {
    Authorization: `Bearer ${userAccessToken}`,
    "Content-Type": "application/json",
  };

  const result = await instance.post("/board", data, { headers });

  return result;
};

export const freeEdit = async ({
  boardIdx,
  userIdx,
  title,
  category,
  description,
  userAccessToken,
  fileUrl,
}: {
  boardIdx: string | string[] | undefined;
  userIdx: number;
  title: string;
  category: string;
  description: string;
  userAccessToken: string;
  fileUrl: String;
}) => {
  const data = {
    boardIdx: boardIdx,
    userIdx: userIdx,
    title: title,
    category: category,
    description: description,
    fileUrl: fileUrl,
  };

  const headers = {
    Authorization: `Bearer ${userAccessToken}`,
    "Content-Type": "application/json",
  };

  const result = await instance.patch(`/board/${boardIdx}`, data, { headers });

  return result;
};

export const freeDelete = async ({
  boardIdx,
  userAccessToken,
}: {
  boardIdx: string | string[] | undefined;
  userAccessToken: string;
}) => {
  const headers = {
    Authorization: `Bearer ${userAccessToken}`,
    "Content-Type": "application/json",
  };

  try {
    const result = await instance.delete(`/board/${boardIdx}`, {
      headers,
      params: {
        boardIdx,
      },
    });

    return result;
  } catch (error) {
    // Handle errors here
    throw error;
  }
};
