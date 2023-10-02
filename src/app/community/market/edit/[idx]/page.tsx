"use client";

import CommunityMenu from "@/components/CommunityMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";
import MarketEdit from "@/components/market/MarketEdit";

export default function MarketEditPage() {
  return (
    <div>
      <CommunityMenu />
      <DndProvider backend={HTML5Backend}>
        <MarketEdit />
      </DndProvider>
    </div>
  );
}
