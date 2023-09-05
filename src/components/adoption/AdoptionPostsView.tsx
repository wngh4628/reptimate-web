import { GetAdoptionPostsView, getResponse } from "@/service/adoption";
import axios from "axios";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function AdoptionPostsView() {
  const params = useParams();
  const idx = params?.idx;

  const [data, setData] = useState<GetAdoptionPostsView | null>(null);

  const getData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.reptimate.store/board/${idx}?userIdx=1`
      );
      // Assuming your response data has a 'result' property
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [idx]);

  useEffect(() => {
    getData();
    console.log(data);
  }, []);

  return (
    <div>
      {/* Render data if it exists */}
      {data && (
        <>
          <p>{idx}</p>
          {/* Access data properties and render them */}
          <p>Title: {data.result.title}</p>
          <p>Description: {data.result.description}</p>
          {/* ...other data properties */}
        </>
      )}
    </div>
  );
}
