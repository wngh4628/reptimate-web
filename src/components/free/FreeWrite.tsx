import { useMutation } from "@tanstack/react-query";
import { Mobile, PC } from "../ResponsiveLayout";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useRouter } from "next/navigation";
import axios from "axios";
import { freeWrite } from "@/api/free/freeBoard";
import { useSetRecoilState } from "recoil";
import { isLoggedInState, userAtom } from "@/recoil/user";
import ImageSelecterWrite from "../ImageSelecterWrite";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import Swal from "sweetalert2";

interface FileItem {
  file: File;
  id: number;
}

const uploadUri = "https://www.reptimate.store/conv/board/upload";

export default function FreeWrite() {
  const router = useRouter();

  function BackButton() {
    const handleGoBack = () => {
      window.history.back(); // Go back to the previous page using window.history
    };

    return (
      <button
        onClick={handleGoBack}
        className="cursor-poiter px-2 font-bold mt-12"
      >
        &lt; 뒤로가기
      </button>
    );
  }
  let userIdx: string | null = null;
  let userAccessToken: string | null = null;
  if (typeof window !== "undefined") {
    // Check if running on the client side
    const storedData = localStorage.getItem("recoil-persist");
    const userData = JSON.parse(storedData || "");
    userIdx = userData.USER_DATA.idx;
    userAccessToken = userData.USER_DATA.accessToken;
  }

  const [selectedFiles, setSelectedFiles] = useState<
    Array<{ file: File; id: number }>
  >([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [showFileLimitWarning, setShowFileLimitWarning] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const file = event.target.files!![0];

    if (selectedFiles.length + files!!.length > 5) {
      Swal.fire({
        text: "사진 및 비디오는 최대 5개까지만 선택가능합니다.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
      event.target.value = "";
    } else {
      if (file) {
        if (file.size > 50 * 1024 * 1024) {
          // Display an error message if the file size exceeds 200MB
          Swal.fire({
            text: "파일의 용량이 너무 큽니다. 파일은 개당 50MB까지만 업로드 가능합니다.",
            confirmButtonText: "확인", // confirm 버튼 텍스트 지정
            confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
          });
          event.target.value = ""; // Clear the file input
        } else {
          if (files) {
            const newFiles: FileItem[] = Array.from(files)
              .slice(0, 5 - selectedFiles.length)
              .map((file) => ({
                file,
                id: Date.now() + Math.random(),
              }));

            setSelectedFiles((prevSelectedFiles) => [
              ...prevSelectedFiles,
              ...newFiles,
            ]);
          }
        }
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

  const mutation = useMutation({
    mutationFn: freeWrite,
    onSuccess: (data) => {
      Swal.fire({
        text: "게시글이 작성되었습니다.",
        confirmButtonText: "확인",
        confirmButtonColor: "#7A75F7",
        customClass: {
          container: "z-[11111]", // Tailwind CSS class for z-index
        },
      }).then((result) => {
        if (result.isConfirmed) {
          window.history.back();
        }
      });
    },
    onError: (data) => {
      alert(data);
      setIsLoading(false);
    },
  });
  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const requestData = {
      userIdx: userIdx || "",
      title: title,
      category: "free",
      description: description.replace(/\n/g, "<br>"),
      userAccessToken: userAccessToken || "",
      fileUrl: "",
    };

    if (title !== "" && description !== "") {
      if (selectedFiles.length === 0) {
        mutation.mutate(requestData);
      } else {
        const formData = new FormData();
        selectedFiles.forEach((fileItem) => {
          formData.append("files", fileItem.file);
        });

        try {
          // Send files to the first server
          const response = await axios.post(uploadUri, formData, {
            headers: {
              Authorization: `Bearer ${userAccessToken}`,
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.status === 201) {
            const responseData = response.data;

            // Now, you can send additional data to the API server
            const requestData1 = {
              userIdx: userIdx || "",
              title: title,
              category: "free",
              description: description.replace(/\n/g, "<br>"),
              userAccessToken: userAccessToken || "",
              fileUrl: responseData.result, // Use the response from the first server
            };

            mutation.mutate(requestData1);
          } else {
            console.error("Error uploading files to the first server.");
            // alert("Error uploading files. Please try again later.");
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error:", error);
          // alert("An error occurred. Please try again later.");
          setIsLoading(false);
        }
      }
    } else {
      // Create a list of missing fields
      const missingFields = [];
      if (title === "") missingFields.push("제목");
      if (description === "") missingFields.push("내용");

      // Create the alert message based on missing fields
      let alertMessage = "아래 입력칸들은 공백일 수 없습니다. :\n";
      alertMessage += missingFields.join(", ");

      Swal.fire({
        text: alertMessage,
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
      setIsLoading(false);
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // console.log(inputValue.length);
    if (inputValue.length <= 40) {
      setTitle(inputValue);
    }
  };
  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 600) {
      setDescription(inputValue);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto px-7">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-[10000] bg-gray-800 bg-opacity-75">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main-color"></div>
        </div>
      )}
      <PC>
        <h2 className="flex flex-col items-center justify-center text-4xl mt-28 font-bold p-10">
          자유 게시글
        </h2>
      </PC>
      <Mobile>
        <h2 className="flex flex-col items-center justify-center text-xl font-bold p-5 mt-10">
          자유 게시글
        </h2>
      </Mobile>
      <PC>
        <DndProvider backend={HTML5Backend}>
          <ImageSelecterWrite
            handleFileSelect={handleFileSelect}
            handleRemoveItem={handleRemoveItem}
            selectedFiles={selectedFiles}
            moveFile={moveFile}
          ></ImageSelecterWrite>
        </DndProvider>
      </PC>
      <Mobile>
        <DndProvider backend={TouchBackend}>
          <ImageSelecterWrite
            handleFileSelect={handleFileSelect}
            handleRemoveItem={handleRemoveItem}
            selectedFiles={selectedFiles}
            moveFile={moveFile}
          ></ImageSelecterWrite>
        </DndProvider>
      </Mobile>

      <div className="mb-4">
        <p className="font-bold text-xl my-2">제목</p>
        <div className="flex">
          <input
            type="text"
            placeholder="제목을 입력해주세요."
            className="focus:outline-none py-[8px] border-b-[1px] text-[17px] w-full"
            value={title}
            onChange={handleTitleChange}
          />
          <div className="flex items-center">
            <span className="text-sm mx-6">{title.length}/40</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center my-2">
          <p className="font-bold text-xl">내용</p>
          <span className="text-sm ml-auto">{description.length}/600</span>
        </div>
        <textarea
          placeholder="생물의 상태 (건강 상태, 특이점 유무, 식사 방식) 등을 입력해 주세요.
            서로가 믿고 거래할 수 있도록, 자세한 정보와 다양한 각도의 상품 사진을 올려주세요."
          className="focus:outline-none px-2 py-2 border-gray-B7B7B7 border text-17px w-full"
          value={description}
          onChange={handleDescriptionChange}
          rows={10} // 세로 행의 개수를 조절합니다.
          style={{ resize: "none" }}
          // onFocus={(event) => handleFocusOn(event)}
        />
      </div>
      {!isLoading ? (
        <form onSubmit={onSubmitHandler}>
          <button
            type="submit"
            className="items-center cursor-pointer inline-flex justify-center text-center align-middle bg-main-color text-white font-bold rounded-[12px] text-[16px] h-[52px] w-full my-10"
          >
            등록
          </button>
        </form>
      ) : (
        <button
          type="button"
          className="items-center cursor-not-allowed inline-flex justify-center text-center align-middle bg-gray-300 text-gray-500 font-bold rounded-[12px] text-[16px] h-[52px] w-full my-10"
          disabled
        >
          등록 중...
        </button>
      )}
    </div>
  );
}
