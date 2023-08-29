import instance from "@/api/index";


export const login = async ({
  email,
  password,
  fbToken
}: {
  email: string;
  password: string;
  fbToken: string;
}) => {
  const data = {
    'email' : email,
    'password' : password,
    'fbToken' : fbToken
  };
  // const config = {"Content-Type": 'application/json'};
  const result = await instance.post("/auth", data);
  return result;
};

export const socialLogin = async ({
  accessToken,
  socialType,
  fbToken
}: {
  accessToken: string;
  socialType: string;
  fbToken: string;
}) => {
  const data = {
    'accessToken' : accessToken,
    'socialType' : socialType,
    'fbToken' : fbToken
  };
  // const config = {"Content-Type": 'application/json'};
  const result = await instance.post("/auth/social", data);

  return result;
};


    
