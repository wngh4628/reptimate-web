"use client"
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import MypageMenu from '@/components/mypage/MypageMenu'
import EditProfileInput from '@/components/mypage/EditProfile'
import { Mobile, PC } from "@/components/ResponsiveLayout";

export default function Home() {
  return (
    <div>
      <PC>
        <div
        className='flex mt-[50px] w-[90%] m-auto justify-center content-center'>
        <MypageMenu/>
        <EditProfileInput/>
        </div>
      </PC>

      <Mobile>
        <div
        className='flex mt-[50px] w-[90%] m-auto justify-center content-center flex-col'>
          <MypageMenu/>
          <EditProfileInput/>
        </div>
      </Mobile>
     
    </div>
    
);
}
