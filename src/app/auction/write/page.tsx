"use client";

import CommunityMenu from "@/components/CommunityMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";
import AuctionWrite from "@/components/auction/AuctionWrite";

export default function AuctionWritePage() {
  return (
    <div>
      <CommunityMenu />
      <DndProvider backend={HTML5Backend}>
        <AuctionWrite />
      </DndProvider>
    </div>
  );
}
