import { useMutation } from "@tanstack/react-query";
import { Mobile, PC } from "../ResponsiveLayout";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { auctionWrite } from "@/api/auction/auction";
import { useSetRecoilState } from "recoil";
import { isLoggedInState, userAtom } from "@/recoil/user";
import ImageSelecterWrite from "../ImageSelecterWrite";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import TimePicker from "../TimePicker";

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

const extension_rule: Option[] = [
  { value: "0", label: "미적용" },
  { value: "1", label: "적용" },
];

const alret_time: Option[] = [
  { value: "0", label: "없음" },
  { value: "5", label: "5분" },
  { value: "10", label: "10분" },
  { value: "30", label: "30분" },
  { value: "60", label: "1시간" },
];

export default function AuctionWrite() {
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
  const [startPrice, setstartPrice] = useState("");
  const [unit, setunit] = useState("");
  const [endTime, setEndTime] = useState("");
  const [rule, setRule] = useState("");
  const [alretTime, setAlretTime] = useState("");

  const [description, setDescription] = useState("");

  const [selling, setSelling] = useState<string>("selling");
  const [variety, setVariety] = useState<string>("품종을 선택하세요");
  const [pattern, setPattern] = useState<string>("모프를 선택하세요");

  const [isLoading, setIsLoading] = useState(false);

  const setUser = useSetRecoilState(userAtom);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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

  useEffect(() => {
    setSelling("selling");
    setRule("0");
  }, []);

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

  const handleRuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRule = e.target.value;
    setRule(selectedRule);
  };

  const handleAlertChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAlert = e.target.value;
    setAlretTime(selectedAlert);
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

    if (selectedFiles.length + files!!.length > 5) {
      alert("사진 및 비디오는 최대 5개까지만 선택가능합니다.");
      event.target.value = "";
    } else {
      if (file) {
        if (file.size > 50 * 1024 * 1024) {
          // Display an error message if the file size exceeds 200MB
          alert(
            "파일의 용량이 너무 큽니다. 파일은 개당 50MB까지만 업로드 가능합니다."
          );
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

  // const FileItem = ({
  //   fileItem,
  //   index,
  // }: {
  //   fileItem: { file: File; id: number };
  //   index: number;
  // }) => {
  //   const [{ isDragging }, drag] = useDrag({
  //     type: "FILE",
  //     item: { index },
  //     collect: (monitor) => ({
  //       isDragging: monitor.isDragging(),
  //     }),
  //   });

  //   const [, drop] = useDrop({
  //     accept: "FILE",
  //     hover: (item: { index: number }) => {
  //       if (item.index !== index) {
  //         moveFile(item.index, index);
  //         item.index = index;
  //       }
  //     },
  //   });

  //   useEffect(() => {
  //     // Preload images when component mounts
  //     selectedFiles.forEach((fileItem) => {
  //       const img = new Image();
  //       img.src = URL.createObjectURL(fileItem.file);
  //     });
  //   }, [selectedFiles]);

  //   const imageUrl = useMemo(
  //     () => URL.createObjectURL(fileItem.file),
  //     [fileItem]
  //   ); // Memoize the image URL

  //   return (
  //     <div>
  //       <PC>
  //         <div ref={(node) => drag(drop(node))}>
  //           <div
  //             key={fileItem.id}
  //             className="relative w-28 h-28 mx-2 border-2 border-gray-300 rounded-xl"
  //             onClick={(e) => e.preventDefault()}
  //           >
  //             {fileItem.file.type.startsWith("image/") ? (
  //               <img
  //                 src={imageUrl}
  //                 alt={`Image ${fileItem.id}`}
  //                 className="object-cover w-full h-full rounded-xl"
  //               />
  //             ) : fileItem.file.type.startsWith("video/") ? (
  //               <video className="object-cover w-full h-full rounded-xl">
  //                 <source src={imageUrl} type={fileItem.file.type} />
  //                 현재 브라우저는 비디오 태그를 지원하지 않습니다.
  //               </video>
  //             ) : (
  //               <p>지원하지 않는 파일 형태</p>
  //             )}
  //             <button
  //               onClick={() => handleRemoveItem(fileItem.id)}
  //               className="absolute -top-2 -right-2 transform translate-x-1/4 -translate-y-1/4 w-6 h-6 bg-red-500 text-white rounded-full"
  //             >
  //               X
  //             </button>
  //           </div>
  //         </div>
  //       </PC>
  //       <Mobile>
  //         <div ref={(node) => drag(drop(node))}>
  //           <div
  //             key={fileItem.id}
  //             className="relative w-20 h-20 mx-1 border-2 border-gray-300 rounded-xl"
  //             onClick={(e) => e.preventDefault()}
  //           >
  //             {fileItem.file.type.startsWith("image/") ? (
  //               <img
  //                 src={imageUrl}
  //                 alt={`Image ${fileItem.id}`}
  //                 className="object-cover w-full h-full rounded-xl"
  //               />
  //             ) : fileItem.file.type.startsWith("video/") ? (
  //               <video className="object-cover w-full h-full rounded-xl">
  //                 <source src={imageUrl} type={fileItem.file.type} />
  //                 현재 브라우저는 비디오 태그를 지원하지 않습니다.
  //               </video>
  //             ) : (
  //               <p>지원하지 않는 파일 형태</p>
  //             )}
  //             <button
  //               onClick={() => handleRemoveItem(fileItem.id)}
  //               className="absolute -top-1 -right-1 transform translate-x-1/4 -translate-y-1/4 w-5 h-5 bg-red-500 text-white text-sm rounded-full"
  //             >
  //               X
  //             </button>
  //           </div>
  //         </div>
  //       </Mobile>
  //     </div>
  //   );
  // };

  const mutation = useMutation({
    mutationFn: auctionWrite,
    onSuccess: (data) => {
      alert(
        "경매글이 임시저장 되었습니다.\n임시 저장된 글은 마이페이지 > 내 경매에서 확인 하실 수 있습니다."
      );
      window.history.back();
    },
    onError: (data: string) => {
      alert(data);
      setIsLoading(false);
    },
  });
  const regExp = /,/g;
  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const now = new Date();
    const nowHours = now.getHours().toString().padStart(2, "0");
    const nowMinutes = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${nowHours}:${nowMinutes}`;

    // Update the endTime state only if the selected time is not before the current time
    if (endTime >= currentTime) {
      setIsLoading(true);

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 해주고 2자리로 포맷
      const day = String(today.getDate()).padStart(2, "0"); // 일자를 2자리로 포맷

      const formattedDate = `${year}-${month}-${day}`;

      const minutesToSubtract = parseInt(alretTime, 10);

      const newTime = new Date(today.getTime() - minutesToSubtract * 60000);

      // newTime을 원하는 형식으로 포맷팅하기 (예: "2023-09-14 12:30" 형태)
      const newYear = newTime.getFullYear();
      const newMonth = String(newTime.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더하고 두 자리로 포맷팅
      const newDay = String(newTime.getDate()).padStart(2, "0");
      const hours = String(newTime.getHours()).padStart(2, "0");
      const minutes = String(newTime.getMinutes()).padStart(2, "0");
      const formattedTime = `${newYear}-${newMonth}-${newDay}T${hours}:${minutes}`;

      let priceReplace = price.replace(regExp, "");
      let startPriceReplace = startPrice.replace(regExp, "");
      let unitReplace = unit.replace(regExp, "");

      const requestData = {
        state: selling,
        userIdx: userIdx || "",
        title: title,
        category: "auction",
        description: description,
        price: priceReplace,
        gender: selectedGender || "",
        size: selectedSize || "",
        variety: variety,
        pattern: pattern,
        startPrice: startPriceReplace,
        unit: unitReplace,
        endTime: formattedDate + "T" + endTime,
        alertTime: formattedTime,
        extensionRule: rule,
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
        startPrice !== "" &&
        unit !== "" &&
        endTime !== "" &&
        rule !== "" &&
        birthDate !== "" &&
        description !== ""
      ) {
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
                state: selling,
                userIdx: userIdx || "",
                title: title,
                category: "auction",
                description: description,
                price: priceReplace,
                gender: selectedGender || "",
                size: selectedSize || "",
                variety: variety,
                pattern: pattern,
                startPrice: startPriceReplace,
                unit: unitReplace,
                endTime: formattedDate + "T" + endTime,
                alertTime: formattedTime,
                extensionRule: rule,
                birthDate: birthDate,
                userAccessToken: userAccessToken || "",
                fileUrl: responseData.result, // Use the response from the first server
              };
              mutation.mutate(requestData1);
            } else {
              console.error("Error uploading files to the first server.");
              alert("Error uploading files. Please try again later.");
              setIsLoading(false);
            }
          } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
            setIsLoading(false);
          }
        }
      } else {
        // Create a list of missing fields
        const missingFields = [];
        if (title === "") missingFields.push("제목");
        if (price === "") missingFields.push("시작 가격");
        if (variety === "품종을 선택하세요") missingFields.push("품종");
        if (pattern === "모프를 선택하세요") missingFields.push("모프");
        if (startPrice === "" || "null") missingFields.push("시작 가격");
        if (unit === "" || "null") missingFields.push("경매 단위");
        if (endTime === "" || "null") missingFields.push("마감 시간");
        if (rule === "" || "null") missingFields.push("연장 룰");
        if (birthDate === "") missingFields.push("생년월일");
        if (selectedGender === "" || "null") missingFields.push("성별");
        if (selectedSize === "" || "null") missingFields.push("크기");
        if (description === "") missingFields.push("내용");

        // Create the alert message based on missing fields
        let alertMessage = "아래 입력칸들은 공백일 수 없습니다. :\n";
        alertMessage += missingFields.join(", ");

        alert(alertMessage);
        setIsLoading(false);
      }
    } else {
      // You can optionally provide feedback to the user (e.g., show an error message)
      alert("마감 시간은 현재 시간 이후의 시간만 선택 가능합니다.");
    }
  };
  const handlePriceChange = (
    value: String,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = event.target.value;
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
          } else if (value == "startPrice") {
            setstartPrice(transComma);
          } else if (value == "unit") {
            setunit(transComma);
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

    if (inputValue.length <= 40) {
      setTitle(inputValue);
    }
  };

  const handleTimeChange = (selectedTime: string) => {
    console.log("Selected Time:", selectedTime);

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;

    // Update the endTime state only if the selected time is not before the current time
    if (selectedTime >= currentTime) {
      setEndTime(selectedTime);
    } else {
      // You can optionally provide feedback to the user (e.g., show an error message)
      alert("마감 시간은 현재 시간 이후의 시간만 선택 가능합니다.");
    }
    // You can perform further actions with the selected time
  };

  return (
    <div className="max-w-screen-md mx-auto mt-20 px-7">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-[10000] bg-gray-800 bg-opacity-75">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main-color"></div>
        </div>
      )}
      <PC>
        <h2 className="flex flex-col items-center justify-center text-4xl font-bold p-10 pt-20">
          경매 등록
        </h2>
      </PC>
      <Mobile>
        <BackButton />
        <h2 className="flex flex-col items-center justify-center text-xl font-bold p-10">
          경매 등록
        </h2>
      </Mobile>
      {/* <div>
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
      </div> */}

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
          <p className="font-bold text-xl my-2">즉시 구입가</p>
          <input
            type="text"
            placeholder="즉시 구입가를 입력해주세요. (원)"
            className="focus:outline-none py-[8px] border-b-[1px] text-[17px] w-full"
            value={price}
            onChange={(e) => handlePriceChange("price", e)}
          />
        </div>

        <div className="mb-4">
          <p className="font-bold text-xl my-2">시작 가격</p>
          <input
            type="text"
            placeholder="시작 가격을 입력해주세요. (원)"
            className="focus:outline-none py-[8px] border-b-[1px] text-[17px] w-full"
            value={startPrice}
            onChange={(e) => handlePriceChange("startPrice", e)}
          />
        </div>

        <div className="mb-4">
          <p className="font-bold text-xl my-2">경매 단위</p>
          <input
            type="text"
            placeholder="경매 단위를 입력해주세요. (원)"
            className="focus:outline-none py-[8px] border-b-[1px] text-[17px] w-full"
            value={unit}
            onChange={(e) => handlePriceChange("unit", e)}
          />
        </div>

        <div className="mb-4">
          <p className="font-bold text-xl my-2">마감 시간</p>
          <div className="flex flex-row">
            <input
              type="time"
              readOnly
              className="focus:outline-none py-[8px] border-b-[1px] text-[17px] w-[90%]"
              value={endTime}
            />
            <button
              className={`w-[10%] py-2 rounded text-md text-white font-bold flex-1 bg-main-color`}
              onClick={handleOpenModal}
            >
              선택
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="font-bold text-xl my-2">연장 룰</p>
          <select
            className="text-black bg-white focus:outline-none text-lg"
            value={rule}
            onChange={handleRuleChange}
          >
            {extension_rule.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <p className="font-bold text-xl my-2">알림 설정</p>
          <select
            className="text-black bg-white focus:outline-none text-lg"
            value={alretTime}
            onChange={handleAlertChange}
          >
            {alret_time.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
                  : "bg-gender-male-color"
                } 
                text-lg text-white font-bold flex-1`}
              onClick={() => handleGenderClick("수컷")}
            >
              수컷
            </button>
            <button
              className={`w-52 py-2 rounded 
              ${selectedGender === "암컷"
                  ? "bg-gender-female-dark-color"
                  : "bg-gender-female-color"
                } 
                text-lg text-white mx-2 font-bold flex-1`}
              onClick={() => handleGenderClick("암컷")}
            >
              암컷
            </button>
            <button
              className={`w-52 py-2 rounded 
              ${selectedGender === "미구분"
                  ? "bg-gender-none-dark-color"
                  : "bg-gender-none-color"
                } 
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
              className={`w-36 py-2 rounded ${selectedSize === "성체"
                ? "bg-main-color"
                : "bg-gender-none-color"
                } text-lg text-white font-bold flex-1`}
              onClick={() => handleSizeClick("성체")}
            >
              성체
            </button>
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
          />
        </div>
      </div>
      {!isLoading ? (
        <form onSubmit={onSubmitHandler}>
          <button
            type="submit"
            className="items-center cursor-pointer inline-flex justify-center text-center align-middle bg-main-color text-white font-bold rounded-[12px] text-[16px] h-[52px] w-full my-10"
          >
            경매 등록
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

      <TimePicker
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onChange={handleTimeChange}
      />
    </div>
  );
}
