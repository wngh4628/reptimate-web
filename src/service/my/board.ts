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
      }>;
    };
  }
  export type Board = {
    idx: number;
    category: string;
    userIdx: number;
    title: string;
    view: number;
    description: string;
    writeDate: Date;
  };
  