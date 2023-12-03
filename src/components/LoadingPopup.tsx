import React from "react";

const LoadingPopup = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingPopup;
