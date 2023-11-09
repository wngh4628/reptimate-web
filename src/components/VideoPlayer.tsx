import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  src: string;
  type: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, type }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);


  useEffect(() => {




      if (type === "m3u8" && videoRef.current) {
      // Check if it's iOS Safari
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      if (isSafari) {
        // Use native HLS support for iOS Safari
        videoRef.current.src = src;
      } else {
        // Use hls.js for other browsers
        const Hls = require("hls.js");
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(videoRef.current);
        }
      }
    }

      // if (type === "m3u8" && Hls.isSupported()) {
      //   const hls = new Hls();
      //   hls.loadSource(src);
      //   hls.attachMedia(videoRef.current!); // Force conversion to a definite value
      // }
  }, [src, type]);

  // Change to use HLS player only when the type is 'm3u8'

  
  if (type === "m3u8") {
    return (
      <div className="absolute inset-0 w-full h-full object-contain bg-black flex justify-center items-center">
        <video ref={videoRef} controls playsInline></video>
      </div>
    );
  } else {
    console.log("111")
    return (
      <video src={src} controls playsInline />
    );
  }

  


};

export default VideoPlayer;
