import Image from "next/image";
import Link from "next/link";
import { Mobile, PC } from "./ResponsiveLayout";
import { Adpotion } from "@/service/my/adoption";

function getTypeText(type:string) {
  switch (type) {
    case 'example':
      return '예제 사진';
    case 'none':
      return '사진 업로드';
    default:
      return '';
  }
}


export default function MorphCard(props:any) {

  
  const imgPath = props.imgPath;
  const type = props.type;

  return (
    <div className="ml-0.5 mr-0.5 relative">
      
          <PC>
          <div className={`flex flex-col justify-center items-center w-[290px] h-[290px] shadow-md shadow-gray-400 rounded-lg bg-gray-100 ${type !== 'example' ? 'hover:border-2 hover:border-main-color rounded-lg cursor-pointer' : ''}`}>
            <img 
              src={imgPath !== null ? imgPath : "/img/reptimate_logo.png"}
              style={{ zIndex: 1 }}
            />
          
            <p className="text-lg absolute bottom-0 mb-5">
              <strong>{getTypeText(type)}</strong>
            </p>
          </div>



          </PC>
          
          <Mobile>
            <div className={`flex flex-col justify-center items-center w-[290px] h-[290px] shadow-md shadow-gray-400 rounded-lg bg-gray-100 ${type !== 'example' ? 'hover:border-2 hover:border-main-color rounded-lg cursor-pointer' : ''}`}>
              <img 
                src={imgPath !== null ? imgPath : "/img/reptimate_logo.png"}
                style={{ zIndex: 1 }}
              />
            
              <p className="text-lg absolute bottom-0 mb-5">
                <strong>{getTypeText(type)}</strong>
              </p>
            </div>

          </Mobile>

    </div>
  );
}
