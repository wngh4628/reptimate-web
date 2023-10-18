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
        idx: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        boardIdx: number;
        buyPrice: number;
        startPrice: number;
        currentPrice: number;
        unit: number;
        alertTime: string;
        endTime: string;
        extensionTime: string;
        extensionRule: number;
        gender: string;
        size: string;
        variety: string;
        pattern: string;
        birthDate: string;
        state: string;
        streamKey: string;
      };
    }>;
  };
}
export type Auction = {
  idx: number;
  createdAt: Date;
  currentPrice: number;
  unit: number;
  endTime: string;
  gender: string;
  size: string;
  variety: string;
  state: string;
  boardIdx: number;
  title: string;
  coverImage: string;
  profilePath: string;
  nickname: string;
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
      message: number;
      action: string;
      board: {
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
    }>;
  };
}
export type Bid = {
  idx: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  type: string;
  score: number;
  roomIdx: string;
  userIdx: number;
  message: number;
  action: string;
  title: string;
};

export interface GetAuctionPostsView {
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
    boardAuction: {
      idx: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
      boardIdx: number;
      buyPrice: number; // 즉시 구매가
      startPrice: number; // 입찰 시작가
      currentPrice: number; // 현재 입찰가
      unit: number; // 경매 입찰가 단위
      alertTime: string; // 경매 시작 전 알림 (언제 시작인지)
      endTime: string; // 경매 마감 시간
      extensionTime: string; // 입찰시 증가하는 시간 extensionRule이 1일 때 만 적용
      extensionRule: number; // 마감 룰, 0이 미적용
      gender: string;
      size: string;
      variety: string;
      pattern: string;
      birthDate: string;
      state: string;
      streamKey: string;
    };
    liveStream: {
      idx: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
      boardIdx: number;
      streamKey: string;
      startTime: string;
      endTime: string;
      state: number;
    };
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

export interface GetAuctionPostsBid {
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
    boardAuction: {
      idx: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
      boardIdx: number;
      buyPrice: number; // 즉시 구매가
      startPrice: number; // 입찰 시작가
      currentPrice: number; // 현재 입찰가
      unit: number; // 경매 입찰가 단위
      alertTime: string; // 경매 시작 전 알림 (언제 시작인지)
      endTime: string; // 경매 마감 시간
      extensionTime: string; // 입찰시 증가하는 시간 extensionRule이 1일 때 만 적용
      extensionRule: number; // 마감 룰, 0이 미적용
      gender: string;
      size: string;
      variety: string;
      pattern: string;
      birthDate: string;
      state: string;
      streamKey: string;
    };
  };
}
