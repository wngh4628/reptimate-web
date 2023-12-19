"use client";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathName = usePathname() || "";

  if (pathName.startsWith("/streamhost")) return null;
  return (
    <div className="mt-10 py-11 text-center bg-gray-100">
      <p className="">
        {"대표자명: 문준호"}
      </p>
      <p className="">
        {"주소: 서울 동작구 사당로16길 7"}
      </p>
      <p className="">
        {"대표 메일: ioteamnova@gmail.com"}
      </p>
      <p className="">
      {"Copyright©ReptiMate All rights reserved."}
      </p>
    </div>
    
  );
}
