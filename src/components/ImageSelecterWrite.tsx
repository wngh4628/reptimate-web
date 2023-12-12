import { Mobile, PC } from "./ResponsiveLayout";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import FileItemWrite from "./FileItemWrite";

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
interface HandleFileSelect {
    (event: React.ChangeEvent<HTMLInputElement>): void;
}

export default function ImageSelecterWrite({
    handleFileSelect,
    handleRemoveItem,
    selectedFiles,
    moveFile
}: {
    handleFileSelect: HandleFileSelect;
    handleRemoveItem: HandleRemoveItem;
    selectedFiles: FileItem[];
    moveFile: MoveFile;
}) {
    return (
        <div className="flex flex-row">
            <input
                type="file"
                accept="image/*, video/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="mediaInput"
                max="5"
            />
            <label
                className="w-auto h-auto cursor-pointer py-3"
                htmlFor="mediaInput"
            >
                <PC>
                    <div className="w-28 h-28 flex flex-col items-center justify-center border-2 border-gray-300 rounded-xl">
                        <img
                            src="/img/camera.png"
                            alt="Camera Icon"
                            className="w-16 h-16"
                        />
                        <span className="">{selectedFiles.length}/5</span>
                    </div>
                </PC>
                <Mobile>
                    <div className="mx-1 w-20 h-20 flex flex-col items-center justify-center border-2 border-gray-300 rounded-xl">
                        <img
                            src="/img/camera.png"
                            alt="Camera Icon"
                            className="w-12 h-12"
                        />
                        <span className="text-sm">{selectedFiles.length}/5</span>
                    </div>
                </Mobile>
            </label>
            <div
                className="flex items-center py-3 mx-auto"
                style={{
                    width: "100%", // 화면 넓이보다 넓도록 설정
                    overflowX: "auto", // 가로 스크롤 허용
                    whiteSpace: "nowrap", // 텍스트 줄 바꿈 방지
                }}
            >
                {selectedFiles.map((fileItem, index) => (
                    <FileItemWrite key={fileItem.id} fileItem={fileItem} index={index} handleRemoveItem={handleRemoveItem} moveFile={moveFile} selectedFiles={selectedFiles}></FileItemWrite>
                    // <FileItem key={fileItem.id} fileItem={fileItem} index={index} />
                ))}
            </div>
        </div>
    );
};


