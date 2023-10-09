"use client";

import CommunityMenu from "@/components/CommunityMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";
import FreeWrite from "@/components/free/FreeWrite";

export default function MarketWritePage() {
  return (
    <div>
      <CommunityMenu />
      <DndProvider backend={HTML5Backend}>
        <FreeWrite />
      </DndProvider>
    </div>
  );
}
