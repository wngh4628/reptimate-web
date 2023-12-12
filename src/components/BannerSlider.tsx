/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Mobile, PC } from "./ResponsiveLayout";

const BannerSlider: React.FC = () => {
  return (
    <div className="">
      <PC>
        <div className="flex w-[1280px] h-[534px] mt-[145px] ml-[40px]" >
          <div className="" style={{position: 'relative',width:890, height:534}}>
            <div
                className="object-cover rounded-md"
                style={{
                  width: 890,
                  height: 534,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
             <img
                  src="/img/reptimate_banner0111.png"
                  alt="First Image"
                  style={{ transition: 'transform 0.3s' }} // 트랜지션 효과 추가
                  className="transform hover:scale-105 object-cover h-[534px] w-[1280px]" // hover 시 확대 효과 클래스 추가
                />
              </div>
          </div>
          <div className="rounded-md" style={{marginLeft:20, width:290, height:534, position: 'relative', cursor: 'pointer',overflow: 'hidden',}}>
            <Carousel
                showArrows={true}
                showThumbs={false}
                autoPlay={true}
                stopOnHover={false}
                interval={5000}
                infiniteLoop={true}
                showStatus={false}
                swipeable={true}
                className=""
                renderArrowPrev={(onClickHandler, hasPrev, label) =>
                  hasPrev && (
                    <button
                      type="button"
                      onClick={onClickHandler}
                      title={label}
                      className="prevButton"
                      style={{ top:"50%", left:"2%", width: 10, height:10, position:"absolute", zIndex :"1000", cursor:"pointer", opacity:"80%"}} // 원하는 위치로 조절
                    >
                      <div style={{ width:30, height:30, backgroundColor:"white", borderRadius:100}}>
                       <img src="/icon/backIcon.png" width={18} height={15} style={{}} alt="backBtn"/>
                       </div>
                    </button>
                  )
                }
                renderArrowNext={(onClickHandler, hasNext, label) =>
                  hasNext && (
                    <button
                      type="button"
                      onClick={onClickHandler}
                      title={label}
                      className="nextButton"
                      style={{top:"50%", right:"8%", width: 10, height:10, position:"absolute" ,zIndex :"100", cursor:"pointer", opacity:"80%"}} // 원하는 위치로 조절
                    >
                      <div style={{ width:30, height:30, backgroundColor:"white", borderRadius:100}}>
                        <img src="/icon/nextIcon.png" width={18} height={15} style={{marginLeft: "1px",}} alt="backBtn"/>
                      </div>
                    </button>
                  )
                }
              >
                 {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="object-cover relative overflow-hidden"
            style={{
              width: 290,
              height: 534,
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s', // 트랜지션 효과 추가
            }}
          >
            <img
              src={`/img/reptimate_banner0${index}.png`} // 이미지 경로에 따라 수정
              alt={`Image ${index}`}
              style={{
                transform: 'scale(1)',
                transition: 'transform 0.3s', // 트랜지션 효과 추가
              }}
              className="transform hover:scale-110" // hover 시 확대 효과 클래스 추가
            />
          </div>
        ))}
            </Carousel>
          </div>
        </div>
      </PC>
      <Mobile>
        <div className="flex, w-full h-60 mt-10">
          <div className="w-full" style={{position: 'relative'}}>
            <div
                className="object-cover h-60 cursor-pointer"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
             <img
                  src="/img/reptimate_banner0111.png"
                  alt="First Image"
                  style={{ transition: 'transform 0.3s' }} // 트랜지션 효과 추가
                  className="transform hover:scale-105 object-cover h-60 w-full" // hover 시 확대 효과 클래스 추가
                />
              </div>
            </div>
          </div>
      </Mobile>
    </div>
  );
};

export default BannerSlider;
