'use client'
import Image from 'next/image'
import React, { useState, useRef, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";

import HostStreamingChatView from "@/components/streamhost/livechat";

export default function Page() {
return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <HostStreamingChatView></HostStreamingChatView>
    </div>
  );
}