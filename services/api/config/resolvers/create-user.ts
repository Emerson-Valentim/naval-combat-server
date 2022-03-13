import { user as UserDomain } from "@naval-combat-server/domains";

const createUser = async (user: typeof UserDomain, input: any) => {
  const newUser = await user.create(input);

  return newUser;
};

export default createUser;
