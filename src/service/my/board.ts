export interface getResponseBoard {
  status: number;
  message: string;
  result: {
    pageSize: number;
    totalCount: number;
    totalPage: number;
    existsNextPage: boolean;
    items: Array<{
      idx: number;
      category: string;
      userIdx: number;
      title: string;
      view: number;
      description: string;
      writeDate: string;
      hasBookmarked: boolean;
    }>;
  };
}
export type Board = {
  idx: number;
  category: string;
  userIdx: number;
  title: string;
  view: number;
  writeDate: Date;
  hasBookmarked: boolean;
};

export interface getResponse {
  status: number;
  message: string;
  result: {
    pageSize: number;
    totalCount: number;
    totalPage: number;
    existsNextPage: boolean;
    items: Array<{
      idx: number;
      view: number;
      userIdx: number;
      title: string;
      category: string;
      description: string;
      writeDate: string;
      thumbnail: string;
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
      hasBookmarked: boolean;
      UserInfo: {
        idx: number;
        nickname: string;
        profilePath: string;
      };
    }>;
  };
}

export type Posts = {
  idx: number;
  view: number;
  userIdx: number;
  title: string;
  category: string;
  thumbnail: string;
  writeDate: Date;
  nickname: string;
  profilePath: string;
  hasBookmarked: boolean;
};

export interface GetPostsView {
  status: number;
  message: string;
  result: {
    idx: number;
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
    commentCnt: number;
    UserInfo: {
      idx: number;
      nickname: string;
      profilePath: string;
    };
    bookmarkCounts: number;
    hasBookmarked: boolean;
  };
}

export type Images = {
  idx: number;
  createdAt: string;
  updatedAt: string;
  boardIdx: number;
  category: string;
  mediaSequence: number;
  path: string;
};
