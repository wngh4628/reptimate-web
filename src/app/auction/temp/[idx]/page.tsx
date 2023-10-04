"use client";

import CommunityMenu from "@/components/CommunityMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";
import AuctionTemp from "@/components/auction/ActionTemp";

export default function AuctionTempPage() {
  return (
    <div>
      <CommunityMenu />
      <DndProvider backend={HTML5Backend}>
        <AuctionTemp />
      </DndProvider>
    </div>
  );
}
