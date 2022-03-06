import { curry } from "ramda";

type HashInput = {
  message: string
  hash: string
}

const verify = async (upash: any, input: HashInput) => {
  const hash = await upash.verify(input.hash, input.message);

  return hash;
};

export default curry(verify);