"use client";

import CommunityMenu from "@/components/CommunityMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";
import FreeEdit from "@/components/free/FreeEdit";
import { TouchBackend } from "react-dnd-touch-backend";

export default function MarketEditPage() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const isMobileDevice = mediaQuery.matches;
    setIsMobile(isMobileDevice);
  }, []);

  const DndProviderComponent = isMobile ? TouchBackend : HTML5Backend;

  return (
    <div>
      <CommunityMenu />
      <DndProvider backend={DndProviderComponent}>
        <FreeEdit />
      </DndProvider>
    </div>
  );
}
