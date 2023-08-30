import { useMutation } from "@tanstack/react-query";
import { Mobile, PC } from "../ResponsiveLayout";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { adoptionWrite } from "@/api/adoption/adoptionWrite";
import { useRouter } from "next/navigation";

interface FileItem {
  file: File;
  id: number;
}
export default function AdoptionWrite() {
  const router = useRouter();

  let userIdx: string | null = null;
  if (typeof window !== "undefined") {
    // Check if running on the client side
    const storedData = localStorage.getItem("recoil-persist");
    const userData = JSON.parse(storedData || "");
    userIdx = userData.USER_DATA.idx;
  }

  const [selectedFiles, setSelectedFiles] = useState<
    Array<{ file: File; id: number }>
  >([]);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [variety, setVariety] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const handleGenderClick = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  const [showFileLimitWarning, setShowFileLimitWarning] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: FileItem[] = Array.from(files)
        .slice(0, 5 - selectedFiles.length)
        .map((file) => ({
          file,
          id: Date.now() + Math.random(),
        }));

      if (selectedFiles.length + newFiles.length > 5) {
        setShowFileLimitWarning(true);
      } else {
        setSelectedFiles((prevSelectedFiles) => [
          ...prevSelectedFiles,
          ...newFiles,
        ]);
      }
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

    const imageUrl = useMemo(
      () => URL.createObjectURL(fileItem.file),
      [fileItem]
    ); // Memoize the image URL

    return (
      <div ref={(node) => drag(drop(node))}>
        <div
          key={fileItem.id}
          className="relative w-32 h-32 mx-2 border-2 border-gray-200"
          onClick={(e) => e.preventDefault()}
        >
          {fileItem.file.type.startsWith("image/") ? (
            <img
              src={imageUrl}
              alt={`Image ${fileItem.id}`}
              className="object-cover w-full h-full"
            />
          ) : fileItem.file.type.startsWith("video/") ? (
            <video className="object-cover w-full h-full">
              <source src={imageUrl} type={fileItem.file.type} />
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

  const mutation = useMutation({
    mutationFn: adoptionWrite,
    onSuccess: (data) => {
      // status code 분기 처리
      console.log("============================");
      console.log("글 작성 성공!");
      console.log(data);
      console.log(data.data);
      console.log("============================");
      router.replace("/board");
    },
  });
  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 리프레시 막기

    const headers = {
      userIdx: userIdx || "",
    };

    {
      mutation.mutate({
        userIdx: userIdx || "",
        title: title,
        category: "adoption",
        description: description,
        price: price,
        gender: selectedGender || "",
        size: selectedSize || "",
        variety: variety,
      });
    }
  };

  return (
    <div className="max-w-screen-md mx-auto">
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
      <div className="">
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
          className="flex overflow-x-auto border-2 border-gray-300 items-center justify-center py-3 cursor-pointer mx-auto"
          htmlFor="mediaInput"
        >
          {selectedFiles.length === 0 && (
            <div className="w-32 h-32 flex flex-col items-center justify-center">
              <img
                src="/img/camera.png"
                alt="Camera Icon"
                className="w-16 h-16"
              />
              <span className="">사진 업로드</span>
            </div>
          )}
          {selectedFiles.map((fileItem, index) => (
            <FileItem key={fileItem.id} fileItem={fileItem} index={index} />
          ))}
        </label>
      </div>
      <div className="mt-4 flex flex-col">
        <p className="font-bold text-xl my-2 ml-3">제목</p>
        <input
          type="text"
          placeholder="제목을 입력해주세요."
          className="focus:outline-none py-[8px] border-b-[1px] text-[17px] w-full ml-3"
        />
        <p className="font-bold text-xl my-2 ml-3">품종</p>
        <input
          type="text"
          placeholder="품종을 입력해주세요."
          className="focus:outline-none py-[8px] border-b-[1px] text-[17px] w-full ml-3"
        />
        <p className="font-bold text-xl my-2 ml-3">성별</p>
        <div className="flex flex-row items-center justify-center">
          <button
            className={`w-52 py-2 rounded ${
              selectedGender === "male"
                ? "bg-gender-male-dark-color"
                : "bg-gender-male-color"
            } text-lg text-white font-bold`}
            onClick={() => handleGenderClick("male")}
          >
            수컷
          </button>
          <button
            className={`w-52 py-2 rounded ${
              selectedGender === "female"
                ? "bg-gender-female-dark-color"
                : "bg-gender-female-color"
            } text-lg text-white font-bold`}
            onClick={() => handleGenderClick("female")}
          >
            암컷
          </button>
          <button
            className={`w-52 py-2 rounded ${
              selectedGender === "none"
                ? "bg-gender-none-dark-color"
                : "bg-gender-none-color"
            } text-lg text-white font-bold`}
            onClick={() => handleGenderClick("none")}
          >
            미구분
          </button>
        </div>
        <p className="font-bold text-xl my-2 ml-3">크기</p>
        <div className="flex flex-row items-center justify-center">
          <button
            className={`w-36 py-2 mx-0.5 rounded ${
              selectedSize === "베이비"
                ? "bg-main-color"
                : "bg-gender-none-color"
            } text-lg text-white font-bold`}
            onClick={() => handleSizeClick("베이비")}
          >
            베이비
          </button>
          <button
            className={`w-36 py-2 mx-0.5 rounded ${
              selectedSize === "아성체"
                ? "bg-main-color"
                : "bg-gender-none-color"
            } text-lg text-white font-bold`}
            onClick={() => handleSizeClick("아성체")}
          >
            아성체
          </button>
          <button
            className={`w-36 py-2 mx-0.5 rounded ${
              selectedSize === "준성체"
                ? "bg-main-color"
                : "bg-gender-none-color"
            } text-lg text-white font-bold`}
            onClick={() => handleSizeClick("준성체")}
          >
            준성체
          </button>
          <button
            className={`w-36 py-2 mx-0.5 rounded ${
              selectedSize === "성체" ? "bg-main-color" : "bg-gender-none-color"
            } text-lg text-white font-bold`}
            onClick={() => handleSizeClick("성체")}
          >
            성체
          </button>
        </div>
        <p className="font-bold text-xl my-2 ml-3">가격</p>
        <input
          type="number"
          placeholder="가격을 입력해주세요. (원)"
          className="focus:outline-none py-[8px] border-b-[1px] text-[17px] w-full ml-3"
        />
        <p className="font-bold text-xl my-2 ml-3">내용</p>
        <input
          type="text"
          placeholder="내용을 입력해주세요."
          className="focus:outline-none py-[8px] border-b-[1px] text-[17px] w-full ml-3"
        />
      </div>
      <form onSubmit={onSubmitHandler}>
        <button
          type="submit"
          className=" items-center cursor-pointer inline-flex justify-center text-center align-middle bg-main-color text-white font-bold rounded-[12px] text-[16px] h-[52px] w-full my-10"
        >
          게시글 등록
        </button>
      </form>
    </div>
  );
}
