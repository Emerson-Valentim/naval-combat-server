import { ForbiddenError } from "apollo-server";
import { user as UserDomain } from "@naval-combat-server/domains";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";

const signOut = async (user: typeof UserDomain, accessTokenData: AuthToken | undefined) => {
  if(!accessTokenData) {
    throw new ForbiddenError("FORBIDDEN");
  }

  await user.signOut(accessTokenData.userId);

  return true;
};

export default signOut;
