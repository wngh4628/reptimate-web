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

  export interface IMessage {
    userIdx: number;
    socketId: string;
    message: string;
    room: string;
  }
  export interface connectMessage {
    userIdx: number;
    socketId: string;
    message: string;
    room: string;
    profilePath: string;
    nickname: string;
  }
  export interface Ban_Message {
    userIdx: number;
    banUserIdx: number;
    room: string;
    boardIdx: number,
  }
  export interface userInfo {
    userIdx: number;
    profilePath: string;
    nickname: string;
  };
  