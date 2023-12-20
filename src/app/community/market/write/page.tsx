"use client";

import CommunityMenu from "@/components/CommunityMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";
import MarketWrite from "@/components/market/MarketWrite";
import { TouchBackend } from "react-dnd-touch-backend";
import { Mobile, PC } from "@/components/ResponsiveLayout";

export default function MarketWritePage() {
  return (
    <div>
      <MarketWrite />
    </div>
  );
}
