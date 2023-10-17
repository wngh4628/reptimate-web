"use client";

import CommunityMenu from "@/components/CommunityMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";
import AuctionWrite from "@/components/auction/AuctionWrite";
import { TouchBackend } from "react-dnd-touch-backend";
import { Mobile, PC } from "@/components/ResponsiveLayout";

export default function AuctionWritePage() {
  return (
    <div>
      <PC>
        <DndProvider backend={HTML5Backend}>
          <AuctionWrite />
        </DndProvider>
      </PC>
      <Mobile>
        <DndProvider backend={TouchBackend}>
          <AuctionWrite />
        </DndProvider>
      </Mobile>
    </div>
  );
}
