'use client'
import Image from 'next/image'
import React, { useState, useRef, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";

import HostStreamingInfoView from "@/components/streamhost/hostHeader";

export default function Page() {
return (
    <div className=" bg-transparent min-h-screen flex justify-center items-center">
      <HostStreamingInfoView></HostStreamingInfoView>
    </div>
  );
}