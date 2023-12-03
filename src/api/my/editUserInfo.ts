import instance from "@/api/index";

export const editAccountInfo = async ({
  accessToken,
  formData,
}: {
  accessToken: string;
  formData: FormData;
}) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "multipart/form-data",
  };
  const result = await instance.patch("/users", formData, { headers });

  return result;
};

export const changePassword = async ({
  accessToken,
  currentPassword,
  newPassword,
}: {
  accessToken: string;
  currentPassword: string;
  newPassword: string;
}) => {
  const data = {
    currentPassword: currentPassword,
    newPassword: newPassword,
  };
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
  const result = await instance.patch("/users/password", data, { headers });

  return result;
};

export const deleteUser = async ({
  accessToken,
  password,
}: {
  accessToken: string;
  password: string;
}) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
  const result = await instance.delete("/users", {
    headers,
    data: { password },
  });

  return result;
};

export const UserInfo = {
  agreeWithMarketing: false,
  createdAt: "",
  email: "",
  fbToken: "",
  idx: 0,
  isPremium: false,
  loginMethod: "",
  nickname: "",
  profilePath: "",
  updatedAt: "",
};
