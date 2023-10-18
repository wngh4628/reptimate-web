export interface getResponseBookmarkBoard {
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
        createdAt: string;
        updatedAt: string;
        deletedAt: string;
        postIdx: number;
        userIdx: number;
        board: {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date;
            category: string;
            userIdx: number;
            title: string;
            thumbnail: string;
            media: string;
            description: string;
            view: number;
            commentCnt: number;
            status: string;
        };
      }>;
    };
  }
  export type BookmarkBoard = {
    idx: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    category: string;
    userIdx: number;
    title: string;
    thumbnail: string;
    media: string;
    description: string;
    view: number;
    commentCnt: number;
    status: string;
  };
  