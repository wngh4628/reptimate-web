"use client";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import MypageMenu from "@/components/mypage/MypageMenu";
import AuctionList from "@/components/mypage/auction/Auction";
import { Mobile, PC } from "@/components/ResponsiveLayout";

export default function Home() {
  return (
    <div>
      <PC>
        <div className="flex mt-[50px] w-[90%] m-auto justify-center content-center">
          <MypageMenu />
          <AuctionList />
        </div>
      </PC>

      <Mobile>
        <div className="flex mt-[10px] w-[90%] m-auto justify-center content-center flex-col">
          <MypageMenu />
          <AuctionList />
        </div>
      </Mobile>
    </div>
  );
}
