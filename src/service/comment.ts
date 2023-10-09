export interface getCommentResponse {
  status: number;
  message: string;
  result: {
    pageSize: number;
    totalCount: number;
    totalPage: number;
    existsNextPage: boolean;
    items: Array<{
      idx: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
      userIdx: number;
      boardIdx: number;
      boardState: string;
      filePath: string | null;
      description: string;
      replyCnt: number;
      UserInfo: {
        idx: number;
        nickname: string;
        profilePath: string;
      };
    }>;
  };
}

export type Comment = {
  idx: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userIdx: number;
  boardIdx: number;
  boardState: string;
  filePath: string | null;
  description: string;
  replyCnt: number;
  nickname: string;
  profilePath: string;
};
