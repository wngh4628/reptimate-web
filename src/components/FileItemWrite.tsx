import { useDrag, useDrop } from "react-dnd";
import { Mobile, PC } from "./ResponsiveLayout";
import VideoThumbnail from "./VideoThumbnail";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

interface HandleRemoveItem {
    (id: number): void;
}
interface MoveFile {
    (dragIndex: number, hoverIndex: number): void;
}
interface FileItem {
    file: File;
    id: number;
}

export default function FileItemWrite({
    fileItem,
    index,
    handleRemoveItem,
    moveFile,
    selectedFiles
}: {
    fileItem: FileItem;
    index: number;
    handleRemoveItem: HandleRemoveItem;
    moveFile: MoveFile;
    selectedFiles: FileItem[];
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

    useEffect(() => {
        // Preload images when component mounts
        selectedFiles.forEach((fileItem: FileItem) => {
            const img = new Image();
            img.src = URL.createObjectURL(fileItem.file);
        });
    }, [selectedFiles]);

    const imageUrl = useMemo(
        () => URL.createObjectURL(fileItem.file),
        [fileItem]
    ); // Memoize the image URL

    return (
        <div>
            <PC>
                <div ref={(node) => drag(drop(node))}>
                    <div
                        key={fileItem.id}
                        className="relative w-28 h-28 mx-2 border-2 border-gray-300 rounded-xl"
                        onClick={(e) => e.preventDefault()}
                    >
                        {fileItem.file.type.startsWith("image/") ? (
                            <img
                                src={imageUrl}
                                alt={`Image ${fileItem.id}`}
                                className="object-cover w-full h-full rounded-xl"
                            />
                        ) : fileItem.file.type.startsWith("video/") ? (
                            <video className="object-cover w-full h-full rounded-xl">
                                <source src={imageUrl} type={fileItem.file.type} />
                                현재 브라우저는 비디오 태그를 지원하지 않습니다.
                            </video>
                        ) : (
                            <p>지원하지 않는 파일 형태</p>
                        )}
                        <button
                            onClick={() => handleRemoveItem(fileItem.id)}
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
                        {fileItem.file.type.startsWith("image/") ? (
                            <img
                                src={imageUrl}
                                alt={`Image ${fileItem.id}`}
                                className="object-cover w-full h-full rounded-xl"
                            />
                        ) : fileItem.file.type.startsWith("video/") ? (
                            <video className="object-cover w-full h-full rounded-xl">
                                <source src={imageUrl} type={fileItem.file.type} />
                                현재 브라우저는 비디오 태그를 지원하지 않습니다.
                            </video>
                        ) : (
                            <p>지원하지 않는 파일 형태</p>
                        )}
                        <button
                            onClick={() => handleRemoveItem(fileItem.id)}
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


