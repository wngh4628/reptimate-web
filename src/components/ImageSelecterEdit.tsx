import { Mobile, PC } from "./ResponsiveLayout";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import FileItemEdit from "./FileItemEdit";

interface HandleRemoveItem {
    (id: number, idx: number): void;
}
interface MoveFile {
    (dragIndex: number, hoverIndex: number): void;
}
interface allFiles {
    idx: number;
    file: File | null;
    url: string | null;
    id: number;
    type: string;
    mediaSequence: number;
}
interface HandleFileSelect {
    (event: React.ChangeEvent<HTMLInputElement>): void;
}

export default function ImageSelecterEdit({
    handleFileSelect,
    handleRemoveItem,
    allFiles,
    moveFile
}: {
    handleFileSelect: HandleFileSelect;
    handleRemoveItem: HandleRemoveItem;
    allFiles: allFiles[];
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
                        <span className="">{allFiles.length}/5</span>
                    </div>
                </PC>
                <Mobile>
                    <div className="mx-1 w-20 h-20 flex flex-col items-center justify-center border-2 border-gray-300 rounded-xl">
                        <img
                            src="/img/camera.png"
                            alt="Camera Icon"
                            className="w-12 h-12"
                        />
                        <span className="text-sm">{allFiles.length}/5</span>
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
                {allFiles.map((fileItem, index) => (
                    <FileItemEdit key={fileItem.id} fileItem={fileItem} index={index} handleRemoveItem={handleRemoveItem} moveFile={moveFile}></FileItemEdit>

                    // <FileItem key={fileItem.id} fileItem={fileItem} index={index} />
                ))}
            </div>
        </div>
    );
};


