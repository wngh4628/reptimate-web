import React from "react";
import '../../styles/action.css'



type Props = {
  children: React.ReactNode;
};

function ActionLayout({ children }: Props) {

  return (
    <>
      {/* <div className="flex-1 overflow-auto text-center pt-24 bg-white" > */}
        <div className="h-full text-black">{children}</div>
      {/* </div> */}
    </>
  );
}

export default ActionLayout;