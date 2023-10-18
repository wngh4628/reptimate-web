import instance from "@/api/index";



// 회원가입
export const register = async ({ email, nickName, password, loginMethod, agreeWithMarketing }:  {
    email: string;
    nickName: string;
    password: string;
    agreeWithMarketing: boolean;
    loginMethod: string;
  }) => {
    const data = {
        'email' : email,
        'nickname' : nickName,
        'password' : password,
        'agreeWithMarketing' : agreeWithMarketing,
        'loginMethod' : loginMethod
      };
  const result = await instance.post("/users", data);

  return result;
};

export const emailSend = async ({ email, type}:  {
    email: string;
    type?: string;
  }) => {
    const data = {
        'email' : email,
        'type' : type
      };
  const result = await instance.post("/users/email-verify", data);

  return result;
};

export const nickNameChk = async ({ nickname, accessToken }:  {
    nickname: string;
    accessToken: string
  }) => {
    const data = {
      'nickname' : nickname
    };
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
  const result = await instance.post("/users/nickname", data, {headers});

  return result;
};