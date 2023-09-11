import instance from "@/api/index";

export const adoptionWrite = async ({
  userIdx,
  title,
  category,
  description,
  price,
  gender,
  size,
  variety,
  pattern,
  birthDate,
  userAccessToken,
  fileUrl,
}: {
  userIdx: string;
  title: string;
  category: string;
  description: string;
  price: string;
  gender: string;
  size: string;
  variety: string;
  pattern: string;
  birthDate: string;
  userAccessToken: string;
  fileUrl: String;
}) => {
  const data = {
    userIdx: userIdx,
    title: title,
    category: category,
    description: description,
    price: price,
    gender: gender,
    size: size,
    variety: variety,
    pattern: pattern,
    birthDate: birthDate,
    fileUrl: fileUrl,
  };

  const headers = {
    Authorization: `Bearer ${userAccessToken}`,
    "Content-Type": "application/json",
  };

  const result = await instance.post("/board", data, { headers });

  return result;
};
