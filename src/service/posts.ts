export interface getResponse {
  status: number;
  message: string;
  result: {
    pageSize: number;
    totalCount: number;
    totalPage: number;
    existsNextPage: boolean;
    items: Array<{
      view: number;
      userIdx: number;
      title: string;
      category: string;
      description: string;
      writeDate: string;
      images: Array<{
        idx: number;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        boardIdx: number;
        category: string;
        mediaSequence: number;
        path: string;
        coverImgPath: string | null;
      }>;
      UserInfo: {
        idx: number;
        nickname: string;
        profilePath: string;
      };
    }>;
  };
}

export type Post = {
  view: number;
  userIdx: number;
  title: string;
  category: string;
  description: string;
  writeDate: Date;
  coverImage: String;
};
