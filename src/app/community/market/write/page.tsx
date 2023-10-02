"use client";

import CommunityMenu from "@/components/CommunityMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";
import MarketWrite from "@/components/market/MarketWrite";

export default function MarketWritePage() {
  return (
    <div>
      <CommunityMenu />
      <DndProvider backend={HTML5Backend}>
        <MarketWrite />
      </DndProvider>
    </div>
  );
}
