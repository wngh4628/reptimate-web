"use client";
import { useEffect, useRef } from "react";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
// import LivePlayerScript from '@/components/js/live-player-script';

type Props = {
  src: string;
};

export default function VideoPlayer(props: Props) {
  const videoRef = useRef(null);

  useEffect(() => {
    // const script = document.createElement('script');
    // script.src = '../../js/demo.js';
    // script.async = true;
    // document.body.appendChild(script);

    // console.log("video!!!!!!!!!");
    // console.log(src);
    const video = videoRef.current;
    if (!video) return;

    // // video.controls = true;
    const defaultOptions = {};
    // if (video.canPlayType('application/vnd.apple.mpegurl')) {
    //     // This will run in safari, where HLS is supported natively
    //     video.src = src;
    // } else if (Hls.isSupported()) {
    // This will run in all other modern browsers
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(props.src);
      const player = new Plyr(video, defaultOptions);
      hls.attachMedia(video);
    }
    // } else {
    //     console.error(
    //         'This is an old browser that does not support MSE https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API'
    //     );
    // }

    return () => {
      // document.body.removeChild(script);
    };
  }, [props.src, videoRef]);

  return (
    <>
      {/* <LivePlayerScript></LivePlayerScript> */}
      <video data-displaymaxtap ref={videoRef} className="w-full" id="player" />
    </>
  );
}
