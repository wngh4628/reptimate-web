import { Images } from "@/service/my/adoption";
import React, { useState } from "react";
import VideoPlayer from "./VideoPlayer";

interface ImageSliderProps {
  imageUrls: Images[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ imageUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const isAtFirstImage = currentIndex === 0;
  const isAtLastImage = currentIndex === imageUrls.length - 1;

  // 이미지가 없으면 빈 div 반환
  if (imageUrls.length === 0) {
    return <div className="image-slider-container"></div>;
  }

  const renderContentByCategory = () => {
    const currentImage = imageUrls[currentIndex];
    if (currentImage.category === "img") {
      return (
        <div className="relative w-full h-0 pb-[100%] overflow-hidden ">
          <img
            src={currentImage.path}
            alt={`Image ${currentIndex}`}
            className="absolute inset-0 w-full h-full object-contain bg-white"
          />
          <div className="absolute inset-x-0 bottom-2 flex justify-center">
            {imageUrls.map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 mx-1 rounded-full ${
                  index === currentIndex ? "bg-main-color" : "bg-gray-300"
                }`}
              ></span>
            ))}
          </div>
          {!isAtFirstImage && (
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 text-white px-3 py-1 rounded-full"
            >
              {"<"}
            </button>
          )}
          {!isAtLastImage && (
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 text-white px-3 py-1 rounded-full"
            >
              {">"}
            </button>
          )}
        </div>
      );
    } else if (currentImage.category === "video") {
      return (
        <div className="relative w-full h-0 pb-[100%] overflow-hidden">
          <VideoPlayer src={currentImage.path} type="m3u8" />
          <div className="absolute inset-x-0 bottom-2 flex justify-center">
            {imageUrls.map((_, index) => (
              <span
                key={index}
                className={`w-3 h-3 mx-1 rounded-full ${
                  index === currentIndex ? "bg-main-color" : "bg-gray-300"
                }`}
              ></span>
            ))}
          </div>
          {!isAtFirstImage && (
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 text-white px-3 py-1 rounded-full"
            >
              {"<"}
            </button>
          )}
          {!isAtLastImage && (
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 text-white px-3 py-1 rounded-full"
            >
              {">"}
            </button>
          )}
        </div>
      );
    } else {
      // Default content for other categories (e.g., img)
      return (
        <div className="relative w-full h-0 pb-[100%] overflow-hidden border-2 border-gray-400">
          <img
            src={currentImage.path}
            alt={`Image ${currentIndex}`}
            className="absolute inset-0 w-full h-full object-contain bg-white"
          />
          <div className="absolute inset-x-0 bottom-2 flex justify-center">
            {imageUrls.map((_, index) => (
              <span
                key={index}
                className={`w-3 h-3 mx-1 rounded-full ${
                  index === currentIndex ? "bg-main-color" : "bg-gray-300"
                }`}
              ></span>
            ))}
          </div>
          {!isAtFirstImage && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full"
            >
              {"<"}
            </button>
          )}
          {!isAtLastImage && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full"
            >
              {">"}
            </button>
          )}
        </div>
      );
    }
  };

  return (
    <div className="image-slider-container">{renderContentByCategory()}</div>
  );
};

export default ImageSlider;
