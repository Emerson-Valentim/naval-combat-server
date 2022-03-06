import { curry } from "ramda";

const hash = async (upash: any, message: string) => {
  const hash = await upash.hash(message);

  return hash;
};

export default curry(hash);