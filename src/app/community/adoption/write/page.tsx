"use client";

import CommunityMenu from "@/components/CommunityMenu";
import AdoptionWrite from "@/components/adoption/AdoptionWrite";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";

export default function AdoptionWritePage() {
  return (
    <div>
      <CommunityMenu />
      <DndProvider backend={HTML5Backend}>
        <AdoptionWrite />
      </DndProvider>
    </div>
  );
}
