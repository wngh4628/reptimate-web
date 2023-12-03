"use client";
import MypageMenu from "@/components/mypage/MypageMenu";
import BoardList from "@/components/mypage/board/Board";
import { Mobile, PC } from "@/components/ResponsiveLayout";

export default function Home() {
  return (
    <div>
      <PC>
        <div className="flex mt-[150px] w-[90%] m-auto justify-center content-center">
          <MypageMenu />
          <BoardList />
        </div>
      </PC>

      <Mobile>
        <div className="flex mt-[10px] w-[90%] m-auto justify-center content-center flex-col">
          <MypageMenu />
          <BoardList />
        </div>
      </Mobile>
    </div>
  );
}
