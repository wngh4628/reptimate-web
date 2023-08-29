
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { socialLogin } from "@/api/login/login";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { userAtom } from "@/recoil/user";
import { useEffect } from "react";
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs'

const signWithApplePrivateKey = "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgUiiZcIJWJ2xXp7H3\nir34K3QzfMCEFI5hAPmqsi9mY1mgCgYIKoZIzj0DAQehRANCAAQXu/gf5jwZ0Axe\nPnEMegZM/OSfHSVivs+xMVr8W7QzQwT4SFMPdTk0Wye8RFNClUmy/E613x1Uwxqq\n2pBgHbAE\n-----END PRIVATE KEY-----";

export const createSignWithAppleSecret = () => {
  const token = jwt.sign({}, signWithApplePrivateKey, {
    algorithm: 'ES256',
    expiresIn: '1h',
    audience: 'https://appleid.apple.com',
    issuer: "T85YW7F828", // TEAM_ID
    subject: "store.reptimate.web", // Service ID
    keyid: "853YM99JRN", // KEY_ID
  });
  return token;
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);
  const { code, id_token } = req.body;

  if (id_token) {
    const url = "https://appleid.apple.com/auth/token";
    try {
      // //애플 토큰 받기
      // const { data } = await axios.post(url, null, {
      //   params: {
      //     grant_type: 'authorization_code',
      //     client_id: "store.reptimate.web", // This is the service ID we created.
      //     redirect_uri: "https://web.reptimate.store/api/applelogin/callback", // As registered along with our service ID
      //     response_type: "code id_token",
      //     client_secret: createSignWithAppleSecret(),
      //     code,
      //   },
      //   headers: {
      //     "Content-Type": "application/x-www-form-urlencoded",
      //   },
      // });

      // const { access_token, refresh_token } = data;

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



