import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  src: string;
  type: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, type }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (type === "m3u8" && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current!); // Force conversion to a definite value
    }
  }, [src, type]);

  // Change to use HLS player only when the type is 'm3u8'
  return type === "m3u8" ? (
    <div className="absolute inset-0 w-full h-full object-contain bg-black flex justify-center items-center">
      <video ref={videoRef} controls playsInline></video>
    </div>
  ) : (
    <video src={src} controls playsInline/>
  );
};

export default VideoPlayer;
