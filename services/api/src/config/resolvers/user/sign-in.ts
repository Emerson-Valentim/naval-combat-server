import { user as UserDomain } from "@naval-combat-server/domains";
import { AuthenticationError } from "apollo-server";

const signIn = async (user: typeof UserDomain, input: any) => {
  try {
    const auth = await user.signIn(input);

    return auth;
  } catch (error) {
    throw new AuthenticationError("UNAUTHORIZED");
  }
};

export default signIn;
