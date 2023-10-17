"use client";

import CommunityMenu from "@/components/CommunityMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";
import AuctionWrite from "@/components/auction/AuctionWrite";
import { TouchBackend } from "react-dnd-touch-backend";

export default function AuctionWritePage() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const isMobileDevice = mediaQuery.matches;
    setIsMobile(isMobileDevice);
  }, []);

  const DndProviderComponent = isMobile ? TouchBackend : HTML5Backend;

  return (
    <div>
      <DndProvider backend={DndProviderComponent}>
        <AuctionWrite />
      </DndProvider>
    </div>
  );
}
