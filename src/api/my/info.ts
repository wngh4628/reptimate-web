import instance from "@/api/index";

export const getAccountInfo = async ({
    accessToken
  }: {
    accessToken: string;
  }) => {
    const data = {
    };
    const headers = {
      Authorization: 'Bearer '+{accessToken},
      'Content-Type': 'application/json'
    };
    const result = await instance.post("/users/me", data, {headers});
  
    return result;
  };