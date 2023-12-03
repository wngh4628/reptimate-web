
import type { NextApiRequest, NextApiResponse } from "next";
import * as jwt from 'jsonwebtoken';


export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // console.log(req.body);
  const { code, id_token } = req.body;

  if (id_token) {
    try {
      const { sub: id, email } = (jwt.decode(id_token) ?? {}) as {
        sub: string;
        email: string;
        name: string;
      };
        
      const redirectUrl = `/login/social?email=${email}&nickname=${email.split('@')[0]}&socialType=APPLE`;

      res.writeHead(302, {
        Location: redirectUrl,
      });
      res.end();
      // No need to continue the rest of the code here
      return;

    }catch{
    }
  } else {
    res.status(200).json({ error: "code가 없습니다." });
  }
}



