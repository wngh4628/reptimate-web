export interface getResponseAuction {
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
        boardAuction: {
            idx: number,
            createdAt: Date,
            updatedAt: Date,
            deletedAt: Date,
            boardIdx: number,
            buyPrice: number,
            startPrice: number,
            currentPrice: number,
            unit: number,
            alertTime: string,
            endTime: string,
            extensionTime: string,
            extensionRule: number,
            gender: string,
            size: string,
            variety: string,
            pattern: string,
            birthDate: string,
            state: string,
            streamKey: string
        };
      }>;
    };
  }
  export type Auction = {
    idx: number,
    createdAt: Date,
    currentPrice: number,
    unit: number,
    endTime: string,
    gender: string,
    size: string,
    variety: string,
    state: string,
    boardIdx: number,
    title: string,
    coverImage: string,
  };
  export interface getResponseBid {
    status: number;
    message: string;
    result: {
      pageSize: number;
      totalCount: number;
      totalPage: number;
      existsNextPage: boolean;
      items: Array<{
        idx: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        type: string;
        score: number;
        roomIdx: string;
        userIdx: number;
        message: string;
        action: string;
      }>;
    };
  }
  export type Bid = {
    idx: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    type: string,
    score: number,
    roomIdx: string,
    userIdx: number,
    message: string,
    action: string,
  };
  