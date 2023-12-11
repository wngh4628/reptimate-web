"use client";

import CommunityMenu from "@/components/CommunityMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";
import FreeEdit from "@/components/free/FreeEdit";
import { TouchBackend } from "react-dnd-touch-backend";
import { Mobile, PC } from "@/components/ResponsiveLayout";

export default function MarketEditPage() {
  return (
    <div>
      <CommunityMenu />
      <FreeEdit />
    </div>
  );
}
