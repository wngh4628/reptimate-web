import { useMutation } from "@tanstack/react-query";
import { Mobile, PC } from "../ResponsiveLayout";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useRouter } from "next/navigation";
import axios from "axios";
import { freeWrite } from "@/api/free/freeBoard";
import { useSetRecoilState } from "recoil";
import { isLoggedInState, userAtom } from "@/recoil/user";

interface FileItem {
  file: File;
  id: number;
}

const uploadUri = "https://www.reptimate.store/conv/board/upload";

export default function FreeWrite() {
  const router = useRouter();

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

  const setUser = useSetRecoilState(userAtom);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  function getCookie(name: string) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length == 2) {
      const cookieValue = parts.pop()?.split(";").shift();
      try {
        const cookieObject = JSON.parse(cookieValue || "");
        return cookieObject;
      } catch (error) {
        console.error("Error parsing JSON from cookie:", error);
        return null;
      }
    }
  }

  useEffect(() => {
    // 안드로이드 웹뷰를 통해 접속한 경우에만 실행됩니다.
    const myAppCookie = getCookie("myAppCookie");

    if (myAppCookie !== undefined) {
      console.log(myAppCookie);
      const accessToken = myAppCookie.accessToken;
      const idx = parseInt(myAppCookie.idx || "", 10) || 0;
      const refreshToken = myAppCookie.refreshToken;
      const nickname = myAppCookie.nickname;
      const profilePath = myAppCookie.profilePath;

      console.log("accessToken: " + accessToken);
      console.log("idx: " + idx);
      console.log("refreshToken: " + refreshToken);
      console.log("nickname: " + nickname);
      console.log("profilePath: " + profilePath);
      setUser({
        accessToken: accessToken || "",
        refreshToken: refreshToken || "",
        idx: idx || 0,
        profilePath: profilePath || "",
        nickname: nickname || "",
      });
      setIsLoggedIn(true);
    }
  }, []);

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
    );
  };

  const mutation = useMutation({
    mutationFn: freeWrite,
    onSuccess: (data) => {
      console.log("============================");
      console.log("Successful writing of post!");
      console.log(data);
      console.log(data.data);
      console.log("============================");
      router.replace("/community/free");
    },
  });
  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const requestData = {
      userIdx: userIdx || "",
      title: title,
      category: "free",
      description: description,
      userAccessToken: userAccessToken || "",
      fileUrl: "",
    };

    if (title !== "") {
      if (selectedFiles.length === 0) {
        mutation.mutate(requestData);
      } else {
        console.log(selectedFiles);

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

            console.log(responseData);
            // Now, you can send additional data to the API server
            const requestData1 = {
              userIdx: userIdx || "",
              title: title,
              category: "free",
              description: description,
              userAccessToken: userAccessToken || "",
              fileUrl: responseData.result, // Use the response from the first server
            };

            console.log(requestData1);

            mutation.mutate(requestData1);
          } else {
            console.error("Error uploading files to the first server.");
            alert("Error uploading files. Please try again later.");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("An error occurred. Please try again later.");
        }
      }
    } else {
      // Create a list of missing fields
      const missingFields = [];
      if (title === "") missingFields.push("제목");

      // Create the alert message based on missing fields
      let alertMessage = "아래 입력칸들은 공백일 수 없습니다. :\n";
      alertMessage += missingFields.join(", ");

      alert(alertMessage);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-screen-md mx-auto">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main-color"></div>
        </div>
      )}
      <PC>
        <h2 className="flex flex-col items-center justify-center text-4xl font-bold p-10">
          자유 게시글
        </h2>
      </PC>
      <Mobile>
        <h2 className="flex flex-col items-center justify-center text-xl font-bold p-10">
          자유 게시글
        </h2>
      </Mobile>
      <div className="">
        <div
          className="flex border-2 border-gray-300 items-center py-3 mx-auto"
          style={{
            width: "100%", // 화면 넓이보다 넓도록 설정
            overflowX: "auto", // 가로 스크롤 허용
            whiteSpace: "nowrap", // 텍스트 줄 바꿈 방지
          }}
        >
          {selectedFiles.length === 0 && (
            <div className="w-auto h-32 flex flex-col items-center justify-center mx-auto">
              <span className="">
                사진 및 비디오 최대 5개까지 선택 가능합니다.
              </span>
            </div>
          )}
          {selectedFiles.map((fileItem, index) => (
            <FileItem key={fileItem.id} fileItem={fileItem} index={index} />
          ))}
        </div>
        <div className="w-auto flex flex-col items-center mx-auto">
          {selectedFiles.length}/5개
        </div>
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
          className="items-center cursor-pointer inline-flex justify-center text-center align-middle bg-main-color text-white font-bold rounded-md text-[16px] h-10 w-full my-2"
          htmlFor="mediaInput"
        >
          파일 선택
        </label>
      </div>
      <div className="mt-4 flex flex-col">
        <p className="font-bold text-xl my-2">제목</p>
        <input
          type="text"
          placeholder="제목을 입력해주세요."
          className="focus:outline-none py-[8px] border-b-[1px] text-[17px] w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p className="font-bold text-xl my-2">내용</p>
        <textarea
          placeholder="내용을 입력해주세요."
          className="focus:outline-none px-2 py-2 border-gray-400 border-2 text-17px w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={10} // 세로 행의 개수를 조절합니다.
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
