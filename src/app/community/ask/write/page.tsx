"use client";

import CommunityMenu from "@/components/CommunityMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";
import AskWrite from "@/components/ask/AskWrite";

export default function MarketWritePage() {
  return (
    <div>
      <CommunityMenu />
      <DndProvider backend={HTML5Backend}>
        <AskWrite />
      </DndProvider>
    </div>
  );
}
