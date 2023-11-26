import instance from "@/api/index";

export const adoptionWrite = async ({
  state,
  userIdx,
  title,
  category,
  description,
  price,
  gender,
  size,
  variety,
  pattern,
  birthDate,
  userAccessToken,
  fileUrl,
}: {
  state: string;
  userIdx: string;
  title: string;
  category: string;
  description: string;
  price: string;
  gender: string;
  size: string;
  variety: string;
  pattern: string;
  birthDate: string;
  userAccessToken: string;
  fileUrl: String;
}) => {
  const data = {
    state: state,
    userIdx: userIdx,
    title: title,
    category: category,
    description: description,
    price: price,
    gender: gender,
    size: size,
    variety: variety,
    pattern: pattern,
    birthDate: birthDate,
    fileUrl: fileUrl,
  };

  const headers = {
    Authorization: `Bearer ${userAccessToken}`,
    "Content-Type": "application/json",
  };

  const result = await instance.post("/board", data, { headers });

  return result;
};

export const adoptionEdit = async ({
  state,
  boardIdx,
  boardCommercialIdx,
  userIdx,
  title,
  category,
  description,
  price,
  gender,
  size,
  variety,
  pattern,
  birthDate,
  userAccessToken,
  fileUrl,
}: {
  state: string;
  boardIdx: string | string[] | undefined;
  boardCommercialIdx: string;
  userIdx: number;
  title: string;
  category: string;
  description: string;
  price: string;
  gender: string;
  size: string;
  variety: string;
  pattern: string;
  birthDate: string;
  userAccessToken: string;
  fileUrl: String;
}) => {
  const data = {
    state: state,
    boardIdx: boardIdx,
    boardCommercialIdx: boardCommercialIdx,
    userIdx: userIdx,
    title: title,
    category: category,
    description: description,
    price: price,
    gender: gender,
    size: size,
    variety: variety,
    pattern: pattern,
    birthDate: birthDate,
    fileUrl: fileUrl,
  };

  const headers = {
    Authorization: `Bearer ${userAccessToken}`,
    "Content-Type": "application/json",
  };

  const result = await instance.patch(`/board/${boardIdx}`, data, { headers });

  return result;
};

export const adoptionDelete = async ({
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
