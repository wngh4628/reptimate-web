import { GetAdoptionPostsView, Images } from "@/service/my/adoption";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Mobile, PC } from "../ResponsiveLayout";
import { useMutation } from "@tanstack/react-query";
import { adoptionEdit } from "@/api/adoption/adoption";
import { useRouter } from "next/navigation";
import { useDrag, useDrop } from "react-dnd";
import VideoThumbnail from "../VideoThumbnail";
import { useSetRecoilState } from "recoil";
import { isLoggedInState, userAtom } from "@/recoil/user";
import ImageSelecterEdit from "../ImageSelecterEdit";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import Swal from "sweetalert2";
interface FileItem {
  idx: number;
  file: File;
  url: string;
  id: number;
  type: string;
  mediaSequence: number;
}

interface Option {
  value: string;
  label: string;
}

const sellingOption: Option[] = [
  { value: "selling", label: "판매중" },
  { value: "end", label: "판매완료" },
  { value: "reservation", label: "예약중" },
];

const varietyOptions: Option[] = [
  { value: "품종을 선택하세요", label: "품종을 선택하세요" },
  { value: "크레스티드 게코", label: "크레스티드 게코" },
  { value: "레오파드 게코", label: "레오파드 게코" },
  { value: "가고일 게코", label: "가고일 게코" },
  { value: "리키 에너스", label: "리키 에너스" },
  { value: "기타", label: "기타" },
];

const patternOptions: Record<string, Option[]> = {
  "품종을 선택하세요": [
    { value: "모프를 선택하세요", label: "모프를 선택하세요" },
  ],
  // Define patterns for each variety option
  "크레스티드 게코": [
    { value: "", label: "모프를 선택하세요" },
    { value: "노멀", label: "노멀" },
    { value: "릴리 화이트", label: "릴리 화이트" },
    { value: "아잔틱", label: "아잔틱" },
    { value: "릴잔틱", label: "릴잔틱" },
    { value: "헷 아잔틱", label: "헷 아잔틱" },
    { value: "릴리 헷 아잔틱", label: "릴리 헷 아잔틱" },
    { value: "세이블", label: "세이블" },
    { value: "카푸치노", label: "카푸치노" },
    { value: "프라푸치노", label: "프라푸치노" },
    { value: "슈퍼 카푸", label: "슈퍼 카푸" },
    { value: "기타", label: "기타" },
  ],
  "레오파드 게코": [
    { value: "", label: "모프를 선택하세요" },
    { value: "갤럭시", label: "갤럭시" },
    { value: "고스트", label: "고스트" },
    { value: "그린", label: "그린" },
    { value: "노멀", label: "노멀" },
    { value: "다크", label: "다크" },
    { value: "데빌", label: "데빌" },
    { value: "라벤더", label: "라벤더" },
    { value: "레드", label: "레드" },
    { value: "만다린", label: "만다린" },
    { value: "블랙 나이트", label: "블랙 나이트" },
    { value: "블러드", label: "블러드" },
    { value: "블리자드", label: "블리자드" },
    { value: "사이퍼", label: "사이퍼" },
    { value: "스노우", label: "스노우" },
    { value: "기타", label: "기타" },
  ],
  "가고일 게코": [
    { value: "", label: "모프를 선택하세요" },
    { value: "노멀", label: "노멀" },
    { value: "레드", label: "레드" },
    { value: "레티큐어 베이컨", label: "레티큐어 베이컨" },
    { value: "블로치드", label: "블로치드" },
    { value: "스켈레톤", label: "스켈레톤" },
    { value: "스트라이프드", label: "스트라이프드" },
    { value: "옐로우", label: "옐로우" },
    { value: "오렌지", label: "오렌지" },
    { value: "화이트", label: "화이트" },
    { value: "기타", label: "기타" },
  ],
  "리키 에너스": [
    { value: "", label: "모프를 선택하세요" },
    { value: "노멀", label: "노멀" },
    { value: "누아나", label: "누아나" },
    { value: "누아미", label: "누아미" },
    { value: "다스 모울", label: "다스 모울" },
    { value: "다크", label: "다크" },
    { value: "레드바", label: "레드바" },
    { value: "리버만", label: "리버만" },
    { value: "멜라니스 스페셜", label: "멜라니스 스페셜" },
    { value: "모로", label: "모로" },
    { value: "얏트", label: "얏트" },
    { value: "코기스", label: "코기스" },
    { value: "트로거", label: "트로거" },
    { value: "트루 컬러", label: "트루 컬러" },
    { value: "파인 아일랜드", label: "파인 아일랜드" },
    { value: "프리델", label: "프리델" },
    { value: "하키토", label: "하키토" },
    { value: "헬 멜라니스틱", label: "헬 멜라니스틱" },
    { value: "GT", label: "GT" },
    { value: "기타", label: "기타" },
  ],
  기타: [
    { value: "", label: "모프를 선택하세요" },
    { value: "기타", label: "기타" },
  ],
};

export default function AdoptionEdit() {
  const router = useRouter();
  const params = useParams();
  const idx = params?.idx;

  const [data, setData] = useState<GetAdoptionPostsView | null>(null);
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

  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState<string>("");

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [selling, setSelling] = useState<string>("selling");
  const [variety, setVariety] = useState<string>("품종을 선택하세요");
  const [pattern, setPattern] = useState<string>("모프를 선택하세요");

  const [boardCommercialIdx, setBoardCommercialIdx] = useState("");

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
      <button
        onClick={handleGoBack}
        className="cursor-poiter px-2 font-bold mt-12"
      >
        &lt; 뒤로가기
      </button>
    );
  }

  let userAccessToken: string | null = null;
  let currentUserIdx: number | null = null;
  let userProfilePath: string | null = null;
  let userNickname: string | null = null;
  if (
    typeof window !== "undefined" &&
    localStorage.getItem("recoil-persist") !== null
  ) {
    // Check if running on the client side
    const storedData = localStorage.getItem("recoil-persist");
    const userData = JSON.parse(storedData || "");
    currentUserIdx = userData.USER_DATA.idx;
    userAccessToken = userData.USER_DATA.accessToken;
    userProfilePath = userData.USER_DATA.profilePath;
    userNickname = userData.USER_DATA.nickname;
  } else {
    router.replace("/");
    Swal.fire({
      text: "로그인이 필요한 기능입니다.",
      confirmButtonText: "확인", // confirm 버튼 텍스트 지정
      confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
    });
  }

  const getData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/board/${idx}?userIdx=${currentUserIdx}`
      );
      // Assuming your response data has a 'result' property
      setData(response.data);
      const post = response.data.result;
      const isCurrentUserComment = currentUserIdx === post.UserInfo.idx;
      if (!isCurrentUserComment) {
        window.history.back();
        Swal.fire({
          text: "잘못된 접근입니다.",
          confirmButtonText: "확인", // confirm 버튼 텍스트 지정
          confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
        });
      } else {
        setSelling(post.boardCommercial.state);
        setTitle(post?.title || "");
        setVariety(post?.boardCommercial.variety || "품종을 선택하세요");
        setPattern(post?.boardCommercial.pattern || "모프를 선택하세요");
        setBirthDate(post?.boardCommercial.birthDate || "연도-월-일");
        setSelectedGender(post?.boardCommercial.gender || "");
        setSelectedSize(post?.boardCommercial.size || "");

        setPrice(handleCommaReplace(post?.boardCommercial.price.toString()) || "");
        setDescription(post?.description || "");
        setBoardCommercialIdx(post?.boardCommercial.idx || "");
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
        if (post.images.length > 0) {
          setMediaSequence(post.images.length - 1);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => { }, [allFiles]);

  useEffect(() => { }, [deletedFiles]);

  const handleVarietyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVariety = e.target.value;
    setVariety(selectedVariety);

    // Reset pattern when variety changes
    setPattern("모프를 선택하세요");
  };

  const handleSellingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSelling = e.target.value;
    setSelling(selectedSelling);
  };

  const handleGenderClick = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setBirthDate(newDate);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const file = event.target.files!![0];

    if (allFiles.length + files!!.length > 5) {
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

  const mutation = useMutation({
    mutationFn: adoptionEdit,
    onSuccess: (data) => {
      Swal.fire({
        text: "게시글 수정이 완료되었습니다.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
      window.history.back();
    },
    onError: (data) => {
     alert(data);
      setIsLoading(false);
    },
  });

  const regExp = /,/g;
  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    let priceReplace = price.replace(regExp, '');
    const requestData = {
      state: selling,
      boardIdx: idx,
      boardCommercialIdx: boardCommercialIdx,
      userIdx: currentUserIdx || 0,
      title: title,
      category: "adoption",
      description: description,
      price: priceReplace,
      gender: selectedGender || "",
      size: selectedSize || "",
      variety: variety,
      pattern: pattern,
      birthDate: birthDate,
      userAccessToken: userAccessToken || "",
      fileUrl: "",
    };

    if (
      title !== "" &&
      price !== "" &&
      selectedGender !== "" &&
      selectedSize !== "" &&
      variety !== "" &&
      pattern !== "" &&
      birthDate !== "" &&
      description !== ""
    ) {
      if (allFiles.length + addFiles.length + deletedFiles.length === 0) {
        mutation.mutate(requestData);
      } else {
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

          console.log(response);
          if (response.status === 201) {
            const responseData = response.data;
            // Now, you can send additional data to the API server
            const requestData1 = {
              state: selling,
              boardIdx: idx,
              boardCommercialIdx: boardCommercialIdx,
              userIdx: currentUserIdx || 0,
              title: title,
              category: "adoption",
              description: description,
              price: priceReplace,
              gender: selectedGender || "",
              size: selectedSize || "",
              variety: variety,
              pattern: pattern,
              birthDate: birthDate,
              userAccessToken: userAccessToken || "",
              fileUrl: "",
            };
            mutation.mutate(requestData1);
          } else {
            // console.error("Error uploading files to the first server.");
            // alert("Error uploading files. Please try again later.");
            setIsLoading(false);
          }
        } catch (error) {
          // console.error("Error:", error);
          // alert("An error occurred. Please try again later.");
          setIsLoading(false);
        }
      }
    } else {
      // Create a list of missing fields
      const missingFields = [];
      if (title === "") missingFields.push("제목");
      if (variety === "품종을 선택하세요") missingFields.push("품종");
      if (pattern === "모프를 선택하세요") missingFields.push("모프");
      if (birthDate === "") missingFields.push("생년월일");
      if (selectedGender == null) missingFields.push("성별");
      if (selectedSize == null) missingFields.push("크기");
      if (price === "") missingFields.push("가격");
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

  const handlePriceChange = (value: String, event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const num = /[0-9]/g;
    const eng = /[a-zA-Z]/g;
    const kor = /[\ㄱ-ㅎㅏ-ㅣ가-힣]/g;
    const regExpTotal = /[\{\}\[\]\/?.;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;

    if (inputValue.search(eng) == -1 && inputValue.search(kor) == -1 && inputValue.search(regExpTotal) == -1) {
      if (inputValue == "" || inputValue.search(num) != -1 || inputValue.search(regExp) != -1) {
        // console.log("***1");

        let replaceComma = inputValue.replace(regExp, '');

        if (replaceComma.length <= 9) {
          // console.log("***2");
          let transComma = replaceComma.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

          if (value == "price") {
            setPrice(transComma);
          }
        }
      }
    }
  };
  const handleCommaReplace = (price: String) => {
    let transComma = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return transComma;

  }

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 600) {
      setDescription(inputValue);
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // console.log(inputValue.length);
    if (inputValue.length <= 40) {
      setTitle(inputValue);
    }
  };
  return (
    <div className="max-w-screen-md mx-auto mt-20 px-7">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-[10000] bg-gray-800 bg-opacity-75">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main-color"></div>
        </div>
      )}
      <PC>
        <h2 className="flex flex-col items-center justify-center text-4xl font-bold p-10">
          분양 게시글
        </h2>
      </PC>
      <Mobile>
        <BackButton />
        <h2 className="flex flex-col items-center justify-center text-xl font-bold p-4 mt-14">
          분양 게시글
        </h2>
      </Mobile>
      <div>
        <p className="font-bold text-xl my-2">거래 상태</p>
        <select
          className="text-black bg-white focus:outline-none text-lg mb-6"
          value={selling}
          onChange={handleSellingChange}
        >
          {sellingOption.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <PC>
        <DndProvider backend={HTML5Backend}>
          <ImageSelecterEdit handleFileSelect={handleFileSelect} handleRemoveItem={handleRemoveItem} allFiles={allFiles} moveFile={moveFile}></ImageSelecterEdit>
        </DndProvider>
      </PC>
      <Mobile>
        <DndProvider backend={TouchBackend}>
          <ImageSelecterEdit handleFileSelect={handleFileSelect} handleRemoveItem={handleRemoveItem} allFiles={allFiles} moveFile={moveFile}></ImageSelecterEdit>
        </DndProvider>
      </Mobile>

      <div className="mx-1 mt-4 flex flex-col">
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

        <div className="mb-4">
          <p className="font-bold text-xl my-2">품종</p>
          <select
            className="text-black bg-white focus:outline-none py-[8px] border-b-[1px] text-lg w-full"
            value={variety}
            onChange={handleVarietyChange}
          >
            {varietyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <p className="font-bold text-xl my-2">모프</p>
          {/* {variety !== "품종을 선택하세요" && patternOptions[variety] && ( */}
          <select
            className="text-black bg-white focus:outline-none py-[8px] border-b-[1px] text-lg w-full"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
          >
            {patternOptions[variety].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* )} */}
        </div>

        <div className="mb-4">
          <p className="font-bold text-xl my-2">생년월일</p>
          <input
            type="date"
            placeholder="선택해주세요."
            className="text-black bg-white focus:outline-none py-[8px] border-b-[1px] text-[17px] w-full"
            value={birthDate}
            onChange={handleDateChange}
          />
        </div>

        <div className="mb-4">
          <p className="font-bold text-xl my-2">성별</p>
          <div className="flex flex-row">
            <button
              className={`w-52 py-2 rounded 
              ${selectedGender === "수컷"
                  ? "bg-gender-male-dark-color"
                  : "bg-gender-male-color"} 
                text-lg text-white font-bold flex-1`}
              onClick={() => handleGenderClick("수컷")}
            >
              수컷
            </button>
            <button
              className={`w-52 py-2 rounded 
              ${selectedGender === "암컷"
                  ? "bg-gender-female-dark-color"
                  : "bg-gender-female-color"} 
                text-lg text-white mx-2 font-bold flex-1`}
              onClick={() => handleGenderClick("암컷")}
            >
              암컷
            </button>
            <button
              className={`w-52 py-2 rounded 
              ${selectedGender === "미구분"
                  ? "bg-gender-none-dark-color"
                  : "bg-gender-none-color"} 
              text-lg text-white font-bold flex-1`}
              onClick={() => handleGenderClick("미구분")}
            >
              미구분
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="font-bold text-xl my-2">크기</p>
          <div className="flex flex-row">
            <button
              className={`w-36 py-2 mr-2 rounded ${selectedSize === "베이비"
                ? "bg-main-color"
                : "bg-gender-none-color"
                } text-lg text-white font-bold flex-1`}
              onClick={() => handleSizeClick("베이비")}
            >
              베이비
            </button>
            <button
              className={`w-36 py-2 mr-2 rounded ${selectedSize === "아성체"
                ? "bg-main-color"
                : "bg-gender-none-color"
                } text-lg text-white font-bold flex-1`}
              onClick={() => handleSizeClick("아성체")}
            >
              아성체
            </button>
            <button
              className={`w-36 py-2 mr-2 rounded ${selectedSize === "준성체"
                ? "bg-main-color"
                : "bg-gender-none-color"
                } text-lg text-white font-bold flex-1`}
              onClick={() => handleSizeClick("준성체")}
            >
              준성체
            </button>
            <button
              className={`w-36 py-2 rounded ${selectedSize === "성체" ? "bg-main-color" : "bg-gender-none-color"
                } text-lg text-white font-bold flex-1`}
              onClick={() => handleSizeClick("성체")}
            >
              성체
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="font-bold text-xl my-2">가격</p>
          <input
            type="text"
            placeholder="가격을 입력해주세요. (원)"
            className="focus:outline-none py-[8px] border-b-[1px] text-[17px] w-full"
            value={price}
            onChange={(e) => handlePriceChange("price", e)}
          />
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
            style={{ resize: 'none' }}
          />
        </div>
      </div>
      {
        !isLoading ? (
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
        )
      }
    </div>
  );
}