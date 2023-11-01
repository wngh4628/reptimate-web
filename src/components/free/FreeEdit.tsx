import axios from "axios";
import { useParams } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Mobile, PC } from "../ResponsiveLayout";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDrag, useDrop } from "react-dnd";
import VideoThumbnail from "../VideoThumbnail";
import { GetPostsView, Images } from "@/service/my/board";
import { freeEdit } from "@/api/free/freeBoard";
import { useSetRecoilState } from "recoil";
import { isLoggedInState, userAtom } from "@/recoil/user";

interface FileItem {
  idx: number;
  file: File;
  url: string;
  id: number;
  type: string;
  mediaSequence: number;
}
export default function FreeEdit() {
  const router = useRouter();
  const params = useParams();
  const idx = params?.idx;

  const [data, setData] = useState<GetPostsView | null>(null);
  const [allFiles, setAllFiles] = useState<
    Array<{
      idx: number;
      file: File | null;
      url: string | null;
      id: number;
      type: string;
      mediaSequence: number;
    }>
  >([]);
  const [addFiles, setAddFiles] = useState<
    Array<{
      idx: number;
      file: File | null;
      url: string | null;
      id: number;
      type: string;
      mediaSequence: number;
    }>
  >([]);
  const [deletedFiles, setDeletedFiles] = useState<Array<number>>([]);
  const [mediaSequence, setMediaSequence] = useState<number>(-1);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const setUser = useSetRecoilState(userAtom);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  // window.onbeforeunload = function (event) {
  //   const confirmationMessage =
  //     "변경 내용이 저장되지 않습니다.\n뒤로 가시겠습니까?";

  //   (event || window.event).returnValue = confirmationMessage;
  //   return confirmationMessage;
  // };

  function BackButton() {
    const handleGoBack = () => {
      window.history.back(); // Go back to the previous page using window.history
    };

    return (
      <button onClick={handleGoBack} className="cursor-poiter px-2 font-bold">
        &lt; 뒤로가기
      </button>
    );
  }

  let userAccessToken: string | null = null;
  let currentUserIdx: number | null = null;
  let userProfilePath: string | null = null;
  let userNickname: string | null = null;
  if (typeof window !== "undefined") {
    // Check if running on the client side
    const storedData = localStorage.getItem("recoil-persist");
    const userData = JSON.parse(storedData || "");
    currentUserIdx = userData.USER_DATA.idx;
    userAccessToken = userData.USER_DATA.accessToken;
    userProfilePath = userData.USER_DATA.profilePath;
    userNickname = userData.USER_DATA.nickname;
  }

  const getData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://reptimate.store/api/board/${idx}?macAdress=`
      );
      // Assuming your response data has a 'result' property
      setData(response.data);
      const post = response.data.result;
      setTitle(post?.title || "");
      setDescription(post?.description || "");
      setAllFiles(
        post.images.map((item: Images) => ({
          idx: item.idx,
          id: Date.now() + Math.random(),
          url: item.path,
          type: item.category,
          file: null,
          mediaSequence: item.mediaSequence,
        }))
      );
      console.log(post.images.length);
      if (post.images.length > 0) {
        setMediaSequence(post.images.length - 1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    getData();
    console.log(allFiles);
  }, []);

  useEffect(() => {
    console.log(allFiles);
  }, [allFiles]);

  useEffect(() => {
    console.log(deletedFiles);
  }, [deletedFiles]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const file = event.target.files!![0];

    if (allFiles.length + files!!.length > 5) {
      alert("사진 및 비디오는 최대 5개까지만 선택가능합니다.");
      event.target.value = "";
    } else {
      if (file) {
        if (file.size > 200 * 1024 * 1024) {
          // Display an error message if the file size exceeds 200MB
          alert(
            "파일의 용량이 너무 큽니다. 파일은 개당 200MB까지만 업로드 가능합니다."
          );
          event.target.value = ""; // Clear the file input
        } else {
          if (files) {
            const newFiles: FileItem[] = Array.from(files)
              .slice(0, 5 - allFiles.length)
              .map((file, index) => ({
                idx: 0,
                file,
                id: Date.now() + Math.random(),
                url: "", // 새로 업로드할 파일의 경우 URL은 null로 설정
                type: file.type,
                mediaSequence: mediaSequence + index + 1, // Increment mediaSequence based on index
              }));

            setMediaSequence(mediaSequence + newFiles.length);

            setAllFiles((prevFiles) => [...prevFiles, ...newFiles]);
            setAddFiles((prevFiles) => [...prevFiles, ...newFiles]);
          }
        }
      }
    }
  };

  const handleRemoveItem = (id: number, idx: number) => {
    setAllFiles((prevUrlImages) =>
      prevUrlImages.filter((item) => item.id !== id)
    );
    setAddFiles((prevUrlImages) =>
      prevUrlImages.filter((item) => item.id !== id)
    );
    if (idx !== 0) {
      setDeletedFiles((prevDeletedFiles) => [...prevDeletedFiles, idx]);
    }
  };

  const moveFile = (dragIndex: number, hoverIndex: number) => {
    const draggedFile = allFiles[dragIndex];
    const updatedFiles = [...allFiles];
    updatedFiles.splice(dragIndex, 1);
    updatedFiles.splice(hoverIndex, 0, draggedFile);
    setAllFiles(updatedFiles);
  };

  const FileItem = ({
    fileItem,
    index,
  }: {
    fileItem: {
      idx: number;
      file: File | null;
      url: string | null;
      id: number;
      type: string;
    };
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

    return (
      <div ref={(node) => drag(drop(node))}>
        <div
          key={fileItem.id}
          className="relative w-28 h-28 mx-2 border-2 border-gray-200"
          onClick={(e) => e.preventDefault()}
        >
          {fileItem.file?.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(fileItem.file)}
              alt={`Image ${fileItem.id}`}
              className="object-cover w-full h-full"
            />
          ) : fileItem.file?.type.startsWith("video/") ? (
            <video className="object-cover w-full h-full">
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
              className="object-cover w-full h-full"
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
    );
  };

  const mutation = useMutation({
    mutationFn: freeEdit,
    onSuccess: (data) => {
      console.log("============================");
      console.log("Successful Editing of post!");
      console.log(data);
      console.log(data.data);
      console.log("============================");
      alert("게시글 수정이 완료되었습니다.");
      router.replace(`/community/free/posts/${idx}`);
    },
  });
  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const requestData = {
      boardIdx: idx,
      userIdx: currentUserIdx || 0,
      title: title,
      category: "free",
      description: description,
      userAccessToken: userAccessToken || "",
      fileUrl: "",
    };

    if (title !== "") {
      if (allFiles.length + addFiles.length + deletedFiles.length === 0) {
        console.log(requestData);
        mutation.mutate(requestData);
      } else {
        console.log(addFiles);

        const formData = new FormData();
        addFiles.forEach((fileItem) => {
          formData.append("files", fileItem.file || "");
        });

        const modifySqenceArr = allFiles.map((item) => item.mediaSequence);
        const deleteIdxArr = deletedFiles;
        const FileIdx = addFiles.map((item) => item.mediaSequence);
        // Append JSON data to the FormData object
        formData.append("modifySqenceArr", JSON.stringify(modifySqenceArr));
        formData.append("deleteIdxArr", JSON.stringify(deleteIdxArr));
        formData.append("FileIdx", JSON.stringify(FileIdx));

        try {
          // Send both FormData and JSON data to the server
          const response = await axios.patch(
            `https://www.reptimate.store/conv/board/update/${idx}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${userAccessToken}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log(response.data);

          if (response.status === 201) {
            const responseData = response.data;

            console.log(responseData);
            // Now, you can send additional data to the API server
            const requestData1 = {
              boardIdx: idx,
              userIdx: currentUserIdx || 0,
              title: title,
              category: "free",
              description: description,
              userAccessToken: userAccessToken || "",
              fileUrl: "",
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
        <BackButton />
        <h2 className="flex flex-col items-center justify-center text-xl font-bold p-4">
          자유 게시글
        </h2>
      </Mobile>
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
          <div className="w-28 h-28 flex flex-col items-center justify-center border-2 border-gray-300 rounded-xl">
            <img
              src="/img/camera.png"
              alt="Camera Icon"
              className="w-16 h-16"
            />
            <span className="">{allFiles.length}/5</span>
          </div>
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
            <FileItem key={fileItem.id} fileItem={fileItem} index={index} />
          ))}
        </div>
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
