'use client'
import React from "react";

import HostStreamingChatView from "@/components/streamhost/livechat";

export default function Page() {
return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <HostStreamingChatView></HostStreamingChatView>
    </div>
  );
}