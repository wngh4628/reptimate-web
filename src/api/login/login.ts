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

export const socialAppleLogin = async ({
  email,
  nickname,
  socialType,
  fbToken
}: {
  email: string;
  nickname: string;
  socialType: string;
  fbToken: string;
}) => {
  const data = {
    'nickname' : nickname,
    'email' : email,
    'socialType' : socialType,
    'fbToken' : fbToken
  };
  // const config = {"Content-Type": 'application/json'};
  const result = await instance.post("/auth/social", data);

  return result;
};

export const sample = async ({
  email,
  nickname,
  socialType,
  fbToken
}: {
  email: string;
  nickname: string;
  socialType: string;
  fbToken: string;
}) => {
  const data = {
    'nickname' : nickname,
    'email' : email,
    'socialType' : socialType,
    'fbToken' : fbToken
  };
  const headers = {
    Authorization: 'Bearer [YourAccessToken]',
    'Content-Type': 'application/json'
  };
  const result = await instance.post("/auth/social", data, {headers});

  return result;
};

export const sample2 = async ({
  email,
  nickname,
  socialType,
  fbToken,
  imageFile
}: {
  email: string;
  nickname: string;
  socialType: string;
  fbToken: string;
  imageFile: File; // Assuming you have the selected image file
}) => {
  const formData = new FormData();
  formData.append('nickname', nickname);
  formData.append('email', email);
  formData.append('socialType', socialType);
  formData.append('fbToken', fbToken);
  formData.append('image', imageFile);

  const headers = {
    Authorization: 'Bearer [YourAccessToken]'
  };

  const result = await instance.post("/auth/social", formData, { headers });

  return result;
};

    
