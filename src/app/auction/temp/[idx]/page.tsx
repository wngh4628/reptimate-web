"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";
import AuctionTemp from "@/components/auction/AuctionTemp";
import { TouchBackend } from "react-dnd-touch-backend";
import { Mobile, PC } from "@/components/ResponsiveLayout";

export default function AuctionTempPage() {
  return (
    <div>
      <AuctionTemp />
    </div>
  );
}
