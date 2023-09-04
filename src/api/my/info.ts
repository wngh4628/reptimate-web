import instance from "@/api/index";

export const getAccountInfo = async ({
    accessToken
  }: {
    accessToken: string;
  }) => {
    const headers = {
      Authorization: 'Bearer ${accessToken}',
      'Content-Type': 'application/json'
    };
    const result = await instance.get("/users/me", {headers});
  
    return result;
  };