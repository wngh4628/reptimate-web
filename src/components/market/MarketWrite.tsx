import { useMutation } from "@tanstack/react-query";
import { Mobile, PC } from "../ResponsiveLayout";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { marketWrite } from "@/api/market/market";
import { useRouter } from "next/navigation";
import axios from "axios";
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

interface Option {
  value: string;
  label: string;
}

const uploadUri = "https://www.reptimate.store/conv/board/upload";

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

export default function MarketWrite() {
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
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState<string>("");

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [selling, setSelling] = useState<string>("selling");
  const [variety, setVariety] = useState<string>("품종을 선택하세요");
  const [pattern, setPattern] = useState<string>("모프를 선택하세요");

  const [isLoading, setIsLoading] = useState(false);

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

  const handleSellingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSelling = e.target.value;
    setSelling(selectedSelling);
  };

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
    mutationFn: marketWrite,
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
  const regExp = /,/g;
  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (price == "" || price.length < 4) {
      Swal.fire({
        text: "가격은 1000원 이상이여야 합니다.",
        confirmButtonText: "확인",
        confirmButtonColor: "#7A75F7",
        customClass: {
          container: "z-[11111]", // Tailwind CSS class for z-index
        },
      });
    } else {
      setIsLoading(true);

      let priceReplace = price.replace(regExp, "");
      const requestData = {
        state: selling,
        userIdx: userIdx || "",
        title: title,
        category: "market",
        description: description,
        price: priceReplace,
        // gender: selectedGender || "",
        // size: selectedSize || "",
        // variety: variety,
        // pattern: pattern,
        // birthDate: birthDate,
        userAccessToken: userAccessToken || "",
        fileUrl: "",
      };

      if (
        title !== "" &&
        price !== "" &&
        // selectedGender !== "" &&
        // selectedSize !== "" &&
        // variety !== "" &&
        // pattern !== "" &&
        // birthDate !== "" &&
        description !== ""
      ) {
        if (selectedFiles.length === 0) {
          Swal.fire({
            text: "한 개 이상의 사진이나 동영상을 첨부해야 합니다.",
            confirmButtonText: "확인",
            confirmButtonColor: "#7A75F7",
            customClass: {
              container: "z-[11111]", // Tailwind CSS class for z-index
            },
          });
          setIsLoading(false);
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
                state: selling,
                userIdx: userIdx || "",
                title: title,
                category: "market",
                description: description,
                price: priceReplace,
                // gender: selectedGender || "",
                // size: selectedSize || "",
                // variety: variety,
                // pattern: pattern,
                // birthDate: birthDate,
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
    }
  };
  const handlePriceChange = (
    value: String,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = event.target.value;

    if (inputValue.length === 1 && inputValue === "0") {
      // Do nothing or show an error message
      return;
    }

    const num = /[0-9]/g;
    const eng = /[a-zA-Z]/g;
    const kor = /[\ㄱ-ㅎㅏ-ㅣ가-힣]/g;
    const regExpTotal = /[\{\}\[\]\/?.;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;

    if (
      inputValue.search(eng) == -1 &&
      inputValue.search(kor) == -1 &&
      inputValue.search(regExpTotal) == -1
    ) {
      if (
        inputValue == "" ||
        inputValue.search(num) != -1 ||
        inputValue.search(regExp) != -1
      ) {
        // console.log("***1");

        let replaceComma = inputValue.replace(regExp, "");

        if (replaceComma.length <= 9) {
          // console.log("***2");
          let transComma = replaceComma
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

          if (value == "price") {
            setPrice(transComma);
          }
        }
      }
    }
  };
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
    <div className="max-w-screen-md mx-auto px-7">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-[10000] bg-gray-800 bg-opacity-75">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main-color"></div>
        </div>
      )}
      <PC>
        <h2 className="flex flex-col items-center justify-center text-4xl font-bold mt-28 p-10">
          중고 거래 게시글
        </h2>
      </PC>
      <Mobile>
        <h2 className="flex flex-col items-center justify-center text-xl mt-10 font-bold p-5">
          중고 거래 게시글
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
          <p className="font-bold text-xl my-2">가격</p>
          <input
            type="text"
            placeholder="가격을 입력해주세요. (최소 1000원 이상)"
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
            style={{ resize: "none" }}
            // onFocus={(event) => handleFocusOn(event)}
          />
        </div>
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
