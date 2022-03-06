import { user } from "@naval-combat-server/domains";

const createUser = async (input: any) => {
  const newUser = await user.create(input);

  return newUser;
};

export default createUser;
