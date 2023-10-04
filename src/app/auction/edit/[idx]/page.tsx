"use client";

import CommunityMenu from "@/components/CommunityMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";
import AuctionEdit from "@/components/auction/AuctionEdit";

export default function AuctionEditPage() {
  return (
    <div>
      <CommunityMenu />
      <DndProvider backend={HTML5Backend}>
        <AuctionEdit />
      </DndProvider>
    </div>
  );
}
