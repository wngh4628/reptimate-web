"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";
import AuctionEdit from "@/components/auction/AuctionEdit";
import { TouchBackend } from "react-dnd-touch-backend";
import { Mobile, PC } from "@/components/ResponsiveLayout";

export default function AuctionEditPage() {
  return (
    <div>
      <AuctionEdit />
    </div>
  );
}
