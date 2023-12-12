"use client";

import CommunityMenu from "@/components/CommunityMenu";
import AdoptionWrite from "@/components/adoption/AdoptionWrite";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";
import { TouchBackend } from "react-dnd-touch-backend";
import { Mobile, PC } from "@/components/ResponsiveLayout";

export default function AdoptionWritePage() {
  return (
    <div>
      <AdoptionWrite />
    </div>
  );
}
