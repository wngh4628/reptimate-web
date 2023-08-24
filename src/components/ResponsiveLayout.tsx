import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface MobileProps {
  children: React.ReactNode;
}

export const Mobile: React.FC<MobileProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 클라이언트 측에서 렌더링 시에만 useMediaQuery를 사용하여 값을 설정합니다.
    const mediaQuery = window.matchMedia("(max-width:768px)");
    setIsMobile(mediaQuery.matches);

    // 이벤트 리스너를 등록하여 화면 크기가 변경될 때마다 값이 업데이트되도록 합니다.
    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    mediaQuery.addListener(handleResize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
    return () => {
      mediaQuery.removeListener(handleResize);
    };
  }, []);

  return <>{isMobile && children}</>;
};

interface PCProps {
  children: React.ReactNode;
}

export const PC: React.FC<PCProps> = ({ children }) => {
  const [isPc, setIsPc] = useState(false);

  useEffect(() => {
    // 클라이언트 측에서 렌더링 시에만 useMediaQuery를 사용하여 값을 설정합니다.
    const mediaQuery = window.matchMedia("(min-width:769px)");
    setIsPc(mediaQuery.matches);

    // 이벤트 리스너를 등록하여 화면 크기가 변경될 때마다 값이 업데이트되도록 합니다.
    const handleResize = () => {
      setIsPc(mediaQuery.matches);
    };

    mediaQuery.addListener(handleResize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
    return () => {
      mediaQuery.removeListener(handleResize);
    };
  }, []);

  return <>{isPc && children}</>;
};
