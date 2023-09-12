import boardAction from "./board-action";
import images from "./images";
import user from "./user";
import liveStream from "./live-stream";

export default interface acitonLiveDto {
    title: string,
    userIdx: number,
    writeDate: Date,
    UserInfo: user,
    boardAction: boardAction,
    liveStream: liveStream,
    images: images,
}