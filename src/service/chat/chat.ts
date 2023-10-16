export interface getResponseChatList {
    status: number;
    message: string;
    result: {
      pageSize: number;
      totalCount: number;
      totalPage: number;
      existsNextPage: boolean;
      items: Array<{
        idx: number;
        state: string;
        userIdx: number;
        deletedAt: string;
        chatRoomIdx: number;
        oppositeIdx: number;
        roomOut: string;
        chatRoom: {
            idx: number;
            // profilePath: string;
            // nickname: string;
            recentMessage: string;
        }
        UserInfo: {
            idx: number;
            nickname: string;
            profilePath: string;
        }
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
  export interface bidMessage {
    userIdx: number;
    score: number;
    message: string;
    roomIdx: string;
    type: string;
    action: string;
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
  export interface chatRoom {
    idx: number;
    state: string;
    userIdx: number;
    deletedAt: string;
    chatRoomIdx: number;
    oppositeIdx: number;
    roomOut: string;
    chatRoom: {
        idx: number;
        createdAt: string;
        updatedAt: string;
        deletedAt: string;
        recentMessage: string;
    }
    UserInfo: {
        idx: number;
        nickname: string;
        profilePath: string;
    }
  };

  