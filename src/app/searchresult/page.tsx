"use client";

import CommunityMenu from "@/components/CommunityMenu";
import FreePosts from "@/components/free/FreePosts";
import { useSearchParams } from 'next/navigation'

export default function SearchResultPage() {

  const searchParams = useSearchParams();

  const searchKeyword = searchParams ? searchParams.get('keyword') : '';


  return (
    <div>
      {/* <FreePosts /> */}

      <div className="mt-40">
        {searchKeyword}

      </div>
    </div>
  );
}
