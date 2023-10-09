"use client";

import CommunityMenu from "@/components/CommunityMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";
import AdoptionEdit from "@/components/adoption/AdoptionEdit";

export default function AdoptionEditPage() {
  return (
    <div>
      <CommunityMenu />
      <DndProvider backend={HTML5Backend}>
        <AdoptionEdit />
      </DndProvider>
    </div>
  );
}
