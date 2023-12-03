import instance from "@/api/index";

export const auctionWrite = async ({
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
  startPrice,
  unit,
  endTime,
  alertTime,
  extensionRule,
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
  startPrice: string;
  unit: string;
  endTime: string;
  alertTime: string;
  extensionRule: string;
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
    startPrice: startPrice,
    unit: unit,
    endTime: endTime,
    alertTime: alertTime,
    extensionRule: extensionRule,
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

export const auctionEdit = async ({
  auctionIdx,
  state,
  boardIdx,
  userIdx,
  title,
  category,
  description,
  price,
  gender,
  size,
  variety,
  pattern,
  startPrice,
  unit,
  endTime,
  alertTime,
  extensionRule,
  birthDate,
  streamKey,
  userAccessToken,
  fileUrl,
}: {
  auctionIdx: string;
  state: string;
  boardIdx: string | string[] | undefined;
  userIdx: string;
  title: string;
  category: string;
  description: string;
  price: string;
  gender: string;
  size: string;
  variety: string;
  pattern: string;
  startPrice: string;
  unit: string;
  endTime: string;
  alertTime: string;
  extensionRule: string;
  birthDate: string;
  streamKey: string;
  userAccessToken: string;
  fileUrl: String;
}) => {
  const data = {
    auctionIdx: auctionIdx,
    state: state,
    boardIdx: boardIdx,
    userIdx: userIdx,
    title: title,
    category: category,
    description: description,
    price: price,
    gender: gender,
    size: size,
    variety: variety,
    pattern: pattern,
    startPrice: startPrice,
    unit: unit,
    endTime: endTime,
    alertTime: alertTime,
    extensionRule: extensionRule,
    birthDate: birthDate,
    streamKey: streamKey,
    fileUrl: fileUrl,
  };

  const headers = {
    Authorization: `Bearer ${userAccessToken}`,
    "Content-Type": "application/json",
  };

  const result = await instance.patch(`/board/${boardIdx}`, data, { headers });

  return result;
};

export const auctionDelete = async ({
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

export const streamKeyEdit = async ({
  boardAuctionIdx,
  streamKey,
  userAccessToken,
}: {
  boardAuctionIdx: number;
  streamKey: string;
  userAccessToken: string;
}) => {
  const data = {
    boardAuctionIdx: boardAuctionIdx,
    streamKey: streamKey,
  };

  const headers = {
    Authorization: `Bearer ${userAccessToken}`,
    "Content-Type": "application/json",
  };

  const result = await instance.patch(
    `/board/Streamkey/${boardAuctionIdx}`,
    data,
    { headers }
  );

  return result;
};
