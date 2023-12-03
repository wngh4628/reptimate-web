export interface getResponseReply {
    status: number;
    message: string;
    result: {
      pageSize: number;
      totalCount: number;
      totalPage: number;
      existsNextPage: boolean;
      items: Array<{
        idx: number;
        boardIdx: number;
        userIdx: number;
        title: string;
        category: string;
        description: string;
        createdAt: Date;
        filePath: string;
      }>;
    };
  }
  
  export type Reply = {
    idx: number;
    boardIdx: number;
    userIdx: number;
    title: string;
    category: string;
    description: string;
    createdAt: Date;
    filePath: string;
  };
  