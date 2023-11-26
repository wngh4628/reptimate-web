"use client";
import AiMenu from "@/components/AiMenu";
import MorphCard from "@/components/MorphCard";
import { Mobile, PC } from "@/components/ResponsiveLayout";

interface Option {
  value: string;
  label: string;
}

const morphOption: Option[] = [
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
];

const genderOption: Option[] = [
  { value: "암컷", label: "암컷" },
  { value: "수컷", label: "수컷" },
];

const thumbnail = null;
const profilePath = null;
const imgStyle = {
  paddingBottom: "100%",
  position: "relative" as "relative",
};


export default function ValueAnalysisPage() {

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // const selectedSort = e.target.value;
    // setSort(selectedSort);
    // setPage(1);
    // setData(null);
  };
  
  return (
    <div>
      <AiMenu />
      <div className="max-w-screen-sm mx-auto">

        <h2 className="text-3xl font-bold pt-5">{'모프 가치 판단'}</h2>

        <div className="flex mt-10 ">
          <div className="flex-auto">
            <h3 className="text-2xl font-bold">{'모프'}</h3>

            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-e-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-3"
            >

              <option value="" selected disabled hidden>모프를 선택해주세요.</option>
              
              
              {morphOption.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

          </div>

          <div className="flex-auto">
            <h3 className="text-2xl font-bold">{'성별'}</h3>

            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-e-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-3"
            >

              <option value="" selected disabled hidden>성별을 선택해주세요.</option>

              {genderOption.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

          </div>
        </div>

        <div className="mt-10">

          <h3 className="text-2xl font-bold">{'윗면'}</h3>
          <p className="mt-3">머리를 왼쪽에 두고 위에서 촬영된 이미지를 선택해주세요.</p>
          
          <div className="flex mt-5">

            <div className="flex-auto">
              <MorphCard imgPath="/img/morph_top.png" type="example"></MorphCard>
            </div>
              
            <div className="flex-auto">
              <MorphCard imgPath="/img/file_upload.png" type="none"></MorphCard>
            </div>

          </div>
        </div>


        <div className="mt-10">

          <h3 className="text-2xl font-bold">{'왼쪽 옆부분'}</h3>
          <p className="mt-3">머리를 왼쪽으로 두고 옆부부을 쵤영한 이미지를 선택해주세요.</p>

          <div className="flex mt-5">

            <div className="flex-auto">
              <MorphCard imgPath="/img/morph_left.png" type="example"></MorphCard>
            </div>
              
            <div className="flex-auto">
              <MorphCard imgPath="/img/file_upload.png" type="none"></MorphCard>
            </div>

          </div>
          </div>


        <div className="mt-10">

          <h3 className="text-2xl font-bold">{'오른쪽 옆부분'}</h3>
          <p className="mt-3">머리를 오른쪽으로 두고 옆부부을 쵤영한 이미지를 선택해주세요.</p>
          
          <div className="flex mt-5">

            <div className="flex-auto">
              <MorphCard imgPath="/img/morph_right.png" type="example"></MorphCard>
            </div>
              
            <div className="flex-auto">
              <MorphCard imgPath="/img/file_upload.png" type="none"></MorphCard>
            </div>

          </div>
        </div>
        
                
        <div className="mt-10 mb-10 flex justify-center">
          <button className=" bg-main-color text-white font-bold py-2 px-4 rounded w-1/2">
            실행
            </button>
        </div>

      </div>

    </div>
      
  );
}
