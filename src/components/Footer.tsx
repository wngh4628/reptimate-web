"use client";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathName = usePathname() || "";

  if (pathName.startsWith("/streamhost")) return null;
  return (
    <p className="py-11 text-center bg-gray-100">
      {"Copyright©ReptiMate All rights reserved."}
    </p>
  );
}
