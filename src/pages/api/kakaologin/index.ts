import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url =
    "https://kauth.kakao.com/oauth/authorize?client_id=007bccc864ba746734949bd87b5bc9dc&redirect_uri=http://localhost:3000/api/kakaologin/callback&response_type=code";
  if (req.method === "POST") {
    res.redirect(307, url);
  } else {
    res.redirect(307, "https://localhost:3000");
  }
}