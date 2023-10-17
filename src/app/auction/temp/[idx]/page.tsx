"use client";

import CommunityMenu from "@/components/CommunityMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";
import AuctionTemp from "@/components/auction/ActionTemp";
import { TouchBackend } from "react-dnd-touch-backend";
import { Mobile, PC } from "@/components/ResponsiveLayout";

export default function AuctionTempPage() {
  return (
    <div>
      <PC>
        <DndProvider backend={HTML5Backend}>
          <AuctionTemp />
        </DndProvider>
      </PC>
      <Mobile>
        <DndProvider backend={TouchBackend}>
          <AuctionTemp />
        </DndProvider>
      </Mobile>
    </div>
  );
}
