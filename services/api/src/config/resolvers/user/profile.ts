import { user as UserDomain } from "@naval-combat-server/domains";
import { AuthenticationError } from "apollo-server";

type Input = {
  userId?: string;
};

const profile = async (user: typeof UserDomain, input: Input) => {
  if (!input.userId) {
    throw new AuthenticationError("UNAUTHORIZED");
  }
  const profile = await user.get(input.userId);

  return profile;
};

export default profile;
