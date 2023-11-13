import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  src: string;
  type: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, type }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (type === "m3u8" && videoRef.current) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      const isAppleWebKit = /^((?!chrome|android).)*AppleWebKit/i.test(
        navigator.userAgent
      );
      if (isSafari || isAppleWebKit) {
        videoRef.current.src = src;
        videoRef.current.setAttribute("playsinline", "true");
      }
      if (type === "m3u8" && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(videoRef.current!); // Force conversion to a definite value
      }
    }
  }, [src, type]);

  if (type === "m3u8") {
    return (
      <div className="absolute inset-0 w-full h-full object-contain bg-black flex justify-center items-center">
        <video ref={videoRef} controls playsInline></video>
      </div>
    );
  } else {
    return <video src={src} controls playsInline />;
  }
};

export default VideoPlayer;
