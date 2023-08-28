import { Adpotion } from "@/service/adoption";
import { Mobile, PC } from "../ResponsiveLayout";
import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

export default function AdoptionWrite() {
  const [selectedFiles, setSelectedFiles] = useState<
    Array<{ file: File; id: number }>
  >([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles((prevSelectedFiles) => [
        ...prevSelectedFiles,
        ...Array.from(files).map((file) => ({
          file,
          id: Date.now() + Math.random(),
        })),
      ]);
    }
  };

  const handleRemoveItem = (id: number) => {
    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.filter((item) => item.id !== id)
    );
  };

  const moveFile = (dragIndex: number, hoverIndex: number) => {
    const draggedFile = selectedFiles[dragIndex];
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(dragIndex, 1);
    updatedFiles.splice(hoverIndex, 0, draggedFile);
    setSelectedFiles(updatedFiles);
  };

  const FileItem = ({
    fileItem,
    index,
  }: {
    fileItem: { file: File; id: number };
    index: number;
  }) => {
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
      selectedFiles.forEach((fileItem) => {
        const img = new Image();
        img.src = URL.createObjectURL(fileItem.file);
      });
    }, [selectedFiles]);

    return (
      <div ref={(node) => drag(drop(node))}>
        <div
          key={fileItem.id}
          className="relative w-32 h-32 mr-2 border-2 border-black"
        >
          {fileItem.file.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(fileItem.file)}
              alt={`Image ${fileItem.id}`}
              className="object-cover w-full h-full"
            />
          ) : fileItem.file.type.startsWith("video/") ? (
            <video className="object-cover w-full h-full">
              <source
                src={URL.createObjectURL(fileItem.file)}
                type={fileItem.file.type}
              />
              Current browsers do not provide a video tag.
            </video>
          ) : (
            <p>Unsupported file format</p>
          )}
          <button
            onClick={() => handleRemoveItem(fileItem.id)}
            className="absolute -top-2 -right-2 transform translate-x-1/4 -translate-y-1/4 w-6 h-6 bg-red-500 text-white rounded-full"
          >
            X
          </button>
        </div>
      </div>
    );
  };

  return (
    <section>
      <PC>
        <h2 className="flex flex-col items-center justify-center text-4xl font-bold p-10">
          분양 게시글
        </h2>
      </PC>
      <Mobile>
        <h2 className="flex flex-col items-center justify-center text-xl font-bold p-10">
          분양 게시글
        </h2>
      </Mobile>
      <div className="p-4">
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
          htmlFor="mediaInput"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded cursor-pointer"
        >
          Select Media (Photos and Videos, up to 5)
        </label>
        <div className="flex overflow-x-auto pt-10">
          {selectedFiles.map((fileItem, index) => (
            <FileItem key={fileItem.id} fileItem={fileItem} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
