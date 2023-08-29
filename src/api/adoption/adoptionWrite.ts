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
}: {
  userIdx: string;
  title: string;
  category: string;
  description: string;
  price: string;
  gender: string;
  size: string;
  variety: string;
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
  };
  const result = await instance.post("/board", data);

  return result;
};
