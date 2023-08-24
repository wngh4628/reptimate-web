import instance from "@/api/index";



// 회원가입
export const register = async ({ email, nickName, password }:  {
    email: string;
    nickName: string;
    password: string;
  }) => {
    const data = {
        'email' : email,
        'nickname' : nickName,
        'password' : password
      };
  const result = await instance.post("/users", data);

  return result;
};