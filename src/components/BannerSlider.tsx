/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Mobile, PC } from "./ResponsiveLayout";
import Link from "next/link";

const BannerSlider: React.FC = () => {
  return (
    <div className="">
      <PC>
        <div className="flex w-[1280px] h-[534px] mt-[145px] ml-[40px]">
          <Link
            href="https://xn--2j1bu40e.com/product/241st-kaf-%EC%BD%94%EB%A6%AC%EC%95%84-%EC%95%A0%EB%8B%88%EB%A9%80%ED%8F%AC%EB%9F%BC-korea-animal-forum-%EC%82%AC%EC%A0%84%EC%98%88%EC%95%BD-%ED%8B%B0%EC%BC%93/10008/category/299/display/1/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div
              className=""
              style={{ position: "relative", width: 890, height: 534 }}
            >
              <div
                className="object-cover rounded-md"
                style={{
                  width: 890,
                  height: 534,
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/img/reptimate_banner1226.png"
                  alt="First Image"
                  style={{ transition: "transform 0.3s" }} // 트랜지션 효과 추가
                  className="transform hover:scale-105 object-cover h-[534px] w-[1280px]" // hover 시 확대 효과 클래스 추가
                />
              </div>
            </div>
          </Link>
          <div
            className="rounded-md"
            style={{
              marginLeft: 20,
              width: 290,
              height: 534,
              position: "relative",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
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
                    style={{
                      top: "50%",
                      left: "2%",
                      width: 10,
                      height: 10,
                      position: "absolute",
                      zIndex: "1000",
                      cursor: "pointer",
                      opacity: "80%",
                    }} // 원하는 위치로 조절
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: "white",
                        borderRadius: 100,
                      }}
                    >
                      <img
                        src="/icon/backIcon.png"
                        width={18}
                        height={15}
                        style={{}}
                        alt="backBtn"
                      />
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
                    style={{
                      top: "50%",
                      right: "8%",
                      width: 10,
                      height: 10,
                      position: "absolute",
                      zIndex: "100",
                      cursor: "pointer",
                      opacity: "80%",
                    }} // 원하는 위치로 조절
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: "white",
                        borderRadius: 100,
                      }}
                    >
                      <img
                        src="/icon/nextIcon.png"
                        width={18}
                        height={15}
                        style={{ marginLeft: "1px" }}
                        alt="backBtn"
                      />
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
                    position: "relative",
                    overflow: "hidden",
                    transition: "transform 0.3s", // 트랜지션 효과 추가
                  }}
                >
                  <img
                    src={`/img/reptimate_banner0${index}.png`} // 이미지 경로에 따라 수정
                    alt={`Image ${index}`}
                    style={{
                      transform: "scale(1)",
                      transition: "transform 0.3s", // 트랜지션 효과 추가
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
        <Link
          href="https://xn--2j1bu40e.com/product/241st-kaf-%EC%BD%94%EB%A6%AC%EC%95%84-%EC%95%A0%EB%8B%88%EB%A9%80%ED%8F%AC%EB%9F%BC-korea-animal-forum-%EC%82%AC%EC%A0%84%EC%98%88%EC%95%BD-%ED%8B%B0%EC%BC%93/10008/category/299/display/1/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex, w-full h-60 mt-10">
            <div className="w-full" style={{ position: "relative" }}>
              <div
                className="object-cover h-60 cursor-pointer"
                style={{
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/img/reptimate_banner1226.png"
                  alt="First Image"
                  style={{ transition: "transform 0.3s" }} // 트랜지션 효과 추가
                  className="transform hover:scale-105 object-cover h-60 w-full" // hover 시 확대 효과 클래스 추가
                />
              </div>
            </div>
          </div>
        </Link>
      </Mobile>
    </div>
  );
};

export default BannerSlider;
