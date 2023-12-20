import Image from "next/image";
import Link from "next/link";
import { Mobile, PC } from "./ResponsiveLayout";
import { Adpotion } from "@/service/my/adoption";
import { useEffect, useState } from "react";

function getTypeText(type: string) {
  switch (type) {
    case "example":
      return "예제 사진";
    case "result":
      return "";
    default:
      return "사진 업로드";
  }
}

export default function MorphCard(props: any) {
  const [imagePath, setImagePath] = useState("");
  const [imageType, setImageType] = useState("");

  const imgPath = props.imgPath;
  const type = props.type;
  const handleFileChange = props.handleFileChange;
  const setImgFile = props.setImgFile;
  const imgFile = props.imgFile;
  
  const showImageFileInImgTag = (imgFile:File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event && event.target && event.target.result) {
        setImagePath(event.target.result as string);
        setImageType("");
      }
    };
    reader.readAsDataURL(imgFile);
  }

  useEffect(() => {
    setImagePath(imgPath);
    setImageType(getTypeText(type));

    // PC <-> MOBILE로 렌더링 될때마다 이미지태그에 보여지는 이미지(프리뷰)를 유지하기 위함
    if (imgFile) {
      showImageFileInImgTag(imgFile)
    }



  }, []);

  return (
    <div className="ml-0.5 mr-0.5 relative">
      {type !== "example" && type !== "result" && (
        <input
          type="file"
          id={type}
          className="hidden"
          onChange={(e) => {
            // 선택한 이미지파일을 부모 컴포넌트의 state로 저장한다
            handleFileChange(e, setImgFile);

            // 선택한 이미지파일을 이미지태그에 미리보기로 보여준다.
            const selectedFile = e.target.files?.[0] || null;

            if (selectedFile) {
              showImageFileInImgTag(selectedFile)
            }
          }}
        />
      )}

      <label
        htmlFor={type !== "example" && type !== "result" ? type : undefined}
      >
        <PC>
          <div
            className={`flex flex-col justify-center items-center w-[290px] h-[290px] shadow-md shadow-gray-400 rounded-lg bg-gray-100 ${
              type !== "example" && type !== "result"
                ? "hover:border-2 hover:border-main-color rounded-lg cursor-pointer"
                : ""
            }`}
          >
            <img
              className={`max-w-full max-h-full ${
                imageType.length === 0 || type === "result"
                  ? "object-cover w-full h-full shadow-md shadow-gray-400 rounded-lg"
                  : ""
              }`}
              src={imagePath}
              style={{ zIndex: 1 }}
              id={type}
            />

            <p className="text-lg absolute bottom-0 mb-5">
              <strong>{imageType}</strong>
            </p>
          </div>
        </PC>

        <Mobile>
          <div
            className={`flex flex-col justify-center items-center w-44 h-44 shadow-md shadow-gray-400 rounded-lg bg-gray-100 ${
              type !== "example" && type !== "result"
                ? "hover:border-2 hover:border-main-color rounded-lg cursor-pointer"
                : ""
            }`}
          >
            <img
              className={`max-w-full max-h-full ${
                imageType.length === 0 || type === "result"
                  ? "object-cover w-full h-full shadow-md shadow-gray-400 rounded-lg"
                  : ""
              }`}
              src={imagePath}
              style={{ zIndex: 1 }}
              id={type}
            />

            <p className="text-mg absolute bottom-0 mb-1.5">
              <strong>{imageType}</strong>
            </p>
          </div>
        </Mobile>
      </label>
    </div>
  );
}
