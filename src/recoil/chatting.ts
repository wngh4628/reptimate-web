import { RecoilState, atom } from "recoil";
import { recoilPersist } from "recoil-persist";
interface banUserInfo {
    idx: number;
    nickname: string;
    profilePath: string;
  }

export const isNewChatState = atom({
    key: "isNewChatState",
    default: false,
});
export const isNewChatIdxState = atom({
    key: "isNewChatIdxState",
    default: 0,
});
export const chatRoomVisisibleState = atom({
    key: "chatRoomVisisibleState",
    default: false,
});
export const chatRoomState = atom({
    key: "chatRoomState",
    default: 0,
});
export const chatNowInfoState = atom({
    key: "chatNowInfoState",
    default: {nickname: "", roomName: 0, profilePath: ""},
});

export const receivedNewChatState = atom({
    key: "receivedNewChatState",
    default: false,
});

export const bannedUserState = atom({
    key: "bannedUserState",
    default: null,
});

export const noChatUserState = atom<banUserInfo[]>({
    key: "noChatUserState",
    default: [],
});

