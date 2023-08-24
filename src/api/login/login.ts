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




    
