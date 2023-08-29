
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { socialLogin } from "@/api/login/login";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { userAtom } from "@/recoil/user";
import { useEffect } from "react";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;

  if (code) {
    const url = "https://oauth2.googleapis.com/token";
    try {
      // 카카오 토큰 받기
      const { data } = await axios.post(url, null, {
        params: {
          grant_type: "authorization_code",
          client_id: `290736847856-24sjvjdch5cpdr5jg64qg1krj19tkfhr.apps.googleusercontent.com`,
          client_secret: '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',
          redirect_uri: "http://localhost:3000/api/googlelogin/callback",
          code,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const { access_token, refresh_token } = data;
        
      const redirectUrl = `/login/social?access_token=${access_token}&socialType=GOOGLE`;

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



