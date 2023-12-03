import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Mobile, PC } from "./ResponsiveLayout";

const BannerSlider: React.FC = () => {
  return (
    <div>
      <PC>
        <div className="">
          <Carousel
            showArrows={true}
            showThumbs={false}
            autoPlay={true}
            stopOnHover={false}
            interval={3000}
            infiniteLoop={true}
            showStatus={false}
            className=""
          >
            <div className="object-cover">
              <img
                src="/img/reptimate_banner01.png"
                alt="First Image"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <img
                src="/img/sample_banner2.png"
                alt="Second Image"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <img
                src="/img/sample_banner3.jpg"
                alt="Third Image"
                className="w-full h-full object-cover"
              />
            </div>
          </Carousel>
        </div>
      </PC>
      <Mobile>
        <Carousel
          showArrows={false}
          showThumbs={false}
          autoPlay={true}
          stopOnHover={false}
          interval={3000}
          infiniteLoop={true}
          showStatus={false}
          className="mt-3"
        >
          <div>
            <img
              src="/img/reptimate_banner01.png"
              alt="First Image"
              className="absolute inset-0 w-full h-full object-contain bg-white"
            />
          </div>
          <div>
            <img
              src="/img/reptimate_banner03.jpg"
              alt="Second Image"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <img
              src="/img/sample_banner3.jpg"
              alt="Third Image"
              className="w-full h-full object-cover"
            />
          </div>
        </Carousel>
      </Mobile>
    </div>
  );
};

export default BannerSlider;
