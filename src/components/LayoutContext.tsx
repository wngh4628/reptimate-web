"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LayoutContextType {
  isHeaderVisible: boolean;
  setIsHeaderVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  return (
    <LayoutContext.Provider value={{ isHeaderVisible, setIsHeaderVisible }}>
      {children}
    </LayoutContext.Provider>
  );
};
