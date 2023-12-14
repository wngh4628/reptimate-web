import CommunityMenu from "@/components/CommunityMenu";
import AdoptionPosts from "@/components/adoption/AdoptionPosts";
import MorphCard from "../MorphCard";

export default function ProgressBar(props:any) {

  const key = props.k;
  const value = props.v;
  const unit = props.unit;

  let rgb = props.rgb;

  if(!rgb){
    rgb = [0,0,0];
  }

  return (
      <div className="flex flex-col items-center w-full ">
        <span className="text-base font-medium">{key}</span>
        <div className="flex justify-center items-center w-full">                
          <div className="w-full bg-gray-300 rounded-full h-2.5 dark:bg-gray-700 ">
            <div className="h-2.5 rounded-full" style={{width: `${unit === '' ? value * 2: value}%`, backgroundColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`}}></div>
          </div>
          <div className="flex justify-center items-center relative ml-12">
            <span className="absolute text-sm font-medium right-3">{unit !== '' ? value : (value === 50 ? '유' : '무')}</span>  
            <span className="absolute text-sm font-medium right-0">{unit}</span>
          </div>
          
        </div>
      </div>
  );
}
