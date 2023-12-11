import { useDrag, useDrop } from "react-dnd";
import { Mobile, PC } from "./ResponsiveLayout";
import VideoThumbnail from "./VideoThumbnail";

interface HandleRemoveItem {
    (id: number, idx: number): void;
}
interface MoveFile {
    (dragIndex: number, hoverIndex: number): void;
}


export default function FileItemEdit({
    fileItem,
    index,
    handleRemoveItem,
    moveFile
}: {
    fileItem: {
        idx: number;
        file: File | null;
        url: string | null;
        id: number;
        type: string;
    };
    index: number;
    handleRemoveItem: HandleRemoveItem;
    moveFile: MoveFile;
}) {
    const [{ isDragging }, drag] = useDrag({
        type: "FILE",
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: "FILE",
        hover: (item: { index: number }) => {
            if (item.index !== index) {
                moveFile(item.index, index);
                item.index = index;
            }
        },
    });

    return (
        <div>

            <PC>
                <div ref={(node) => drag(drop(node))}>
                    <div
                        key={fileItem.id}
                        className="relative w-28 h-28 mx-2 border-2 border-gray-200 rounded-xl"
                        onClick={(e) => e.preventDefault()}
                    >
                        {fileItem.file?.type.startsWith("image/") ? (
                            <img
                                src={URL.createObjectURL(fileItem.file)}
                                alt={`Image ${fileItem.id}`}
                                className="object-cover w-full h-full rounded-xl"
                            />
                        ) : fileItem.file?.type.startsWith("video/") ? (
                            <video className="object-cover w-full h-full rounded-xl">
                                <source
                                    src={URL.createObjectURL(fileItem.file)}
                                    type={fileItem.file.type}
                                />
                                현재 브라우저는 비디오 태그를 지원하지 않습니다.
                            </video>
                        ) : fileItem.type == "img" ? (
                            <img
                                src={fileItem.url || ""}
                                alt={`Image ${fileItem.id}`}
                                className="object-cover w-full h-full rounded-xl"
                            />
                        ) : fileItem.type == "video" ? (
                            <VideoThumbnail src={fileItem.url || ""} type="m3u8" />
                        ) : (
                            <p>지원하지 않는 파일 형태</p>
                        )}
                        <button
                            onClick={() => handleRemoveItem(fileItem.id, fileItem.idx)}
                            className="absolute -top-2 -right-2 transform translate-x-1/4 -translate-y-1/4 w-6 h-6 bg-red-500 text-white rounded-full"
                        >
                            X
                        </button>
                    </div>
                </div>
            </PC>
            <Mobile>
                <div ref={(node) => drag(drop(node))}>
                    <div
                        key={fileItem.id}
                        className="relative w-20 h-20 mx-1 border-2 border-gray-300 rounded-xl"
                        onClick={(e) => e.preventDefault()}
                    >
                        {fileItem.file?.type.startsWith("image/") ? (
                            <img
                                src={URL.createObjectURL(fileItem.file)}
                                alt={`Image ${fileItem.id}`}
                                className="object-cover w-full h-full rounded-xl"
                            />
                        ) : fileItem.file?.type.startsWith("video/") ? (
                            <video className="object-cover w-full h-full rounded-xl">
                                <source
                                    src={URL.createObjectURL(fileItem.file)}
                                    type={fileItem.file.type}
                                />
                                현재 브라우저는 비디오 태그를 지원하지 않습니다.
                            </video>
                        ) : fileItem.type == "img" ? (
                            <img
                                src={fileItem.url || ""}
                                alt={`Image ${fileItem.id}`}
                                className="object-cover w-full h-full rounded-xl"
                            />
                        ) : fileItem.type == "video" ? (
                            <VideoThumbnail src={fileItem.url || ""} type="m3u8" />
                        ) : (
                            <p>지원하지 않는 파일 형태</p>
                        )}
                        <button
                            onClick={() => handleRemoveItem(fileItem.id, fileItem.idx)}
                            className="absolute -top-1 -right-1 transform translate-x-1/4 -translate-y-1/4 w-5 h-5 bg-red-500 text-white text-sm rounded-full"
                        >
                            X
                        </button>
                    </div>
                </div>
            </Mobile>
        </div>
    );
};

