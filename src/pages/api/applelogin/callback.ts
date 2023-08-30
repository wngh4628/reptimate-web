
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


export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);
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



