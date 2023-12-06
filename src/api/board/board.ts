import instance from "@/api/index";

export const boardRegisterBookmark = async ({
    userAccessToken,
    boardIdx, 
    userIdx,
  }: {
    userAccessToken: string;
    boardIdx: number;
    userIdx: number;
  }) => {
    const data = {
      boardIdx: boardIdx,
      userIdx: userIdx,
      category: "board",
    };
  
    const headers = {
      Authorization: `Bearer ${userAccessToken}`,
      "Content-Type": "application/json",
    };
  
    const result = await instance.post(`/board/${boardIdx}/Bookmark/board`, data, { headers });
    return result;
  };
  
  export const boardDeleteBookmark = async ({
    userAccessToken,
    boardIdx, 
  }: {
    userAccessToken: string;
    boardIdx: number;
  }) => {
  
    const headers = {
      Authorization: `Bearer ${userAccessToken}`,
      "Content-Type": "application/json",
    };
  
    const result = await instance.delete(`/board/${boardIdx}/Bookmark`, { headers });
    return result;
  };