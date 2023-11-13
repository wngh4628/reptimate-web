
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
    const url = "https://kauth.kakao.com/oauth/token";
    try {
      // 카카오 토큰 받기
      const { data } = await axios.post(url, null, {
        params: {
          grant_type: "authorization_code",
          client_id: `${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}`,
          redirect_uri: "https://web.reptimate.store/api/kakaologin/callback",
          code,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const { access_token, refresh_token } = data;

      const redirectUrl = `/login/social?access_token=${access_token}&socialType=KAKAO`;

      //사용자 정보 조회하기(이메일이랑 프로필 이미지 검색)
      const infoResult = await axios.post(
        "https://kapi.kakao.com/v2/user/me",
        null,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const email = infoResult.data.kakao_account.email;
      const profileImage = infoResult.data.properties.profile_image;

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



