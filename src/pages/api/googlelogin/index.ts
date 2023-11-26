import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url =
    'https://accounts.google.com/o/oauth2/v2/auth?client_id=' +
    '290736847856-24sjvjdch5cpdr5jg64qg1krj19tkfhr.apps.googleusercontent.com' +
      '&redirect_uri=' +
      'https://web.reptimate.store/api/googlelogin/callback' +
      '&response_type=code' +
      '&scope=email profile';
  if (req.method === "POST") {
    res.redirect(307, url);
  } else {
    res.redirect(307, "https://web.reptimate.store");
  }
}