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
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      const isAppleWebKit = /^((?!chrome|android).)*iPhone/i.test(
        navigator.userAgent
      );
      if (isSafari || isAppleWebKit) {
        videoRef.current.src = src;
        videoRef.current.setAttribute("playsinline", "true");
      } else {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(videoRef.current);
        }
      }
    }
  }, [src, type]);

  if (type === "m3u8") {
    return (
      <div>
        <video
          className="absolute inset-0 w-full h-full object-contain bg-black"
          ref={videoRef}
          controls
          playsInline
        ></video>
      </div>
    );
  } else {
    return <video src={src} controls playsInline />;
  }
};

export default VideoPlayer;
