import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";



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