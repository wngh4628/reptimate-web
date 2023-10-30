import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const BannerSlider: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto">
      <Carousel
        showArrows={false}
        showThumbs={false}
        autoPlay={true}
        stopOnHover={true}
        interval={3000}
        infiniteLoop={true}
        showStatus={false}
        className="h-64 md:h-64 lg:h-96 mt-3"
      >
        <div>
          <img
            src="/img/sample_banner1.png"
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
  );
};

export default BannerSlider;
