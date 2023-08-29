
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
    const url = "";
    try {
      // 카카오 토큰 받기
      const { data } = await axios.post(url, null, {
        params: {
          client_id: "store.reptimate.web", // This is the service ID we created.
          redirect_uri: "https://localhost:3000/api/applelogin/callback", // As registered along with our service ID
          response_type: "code id_token",
          state: "origin:web", // Any string of your choice that you may use for some logic. It's optional and you may omit it.
          scope: "name email", // To tell apple we want the user name and emails fields in the response it sends us.
          response_mode: "form_post",
          m: 11,
          v: "1.5.4",
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const { access_token, refresh_token } = data;
        
      const redirectUrl = `/login/social?access_token=${access_token}&socialType=APPLE`;

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



