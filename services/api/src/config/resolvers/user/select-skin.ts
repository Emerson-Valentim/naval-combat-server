import { user as UserDomain } from "@naval-combat-server/domains";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";
import { AuthenticationError } from "apollo-server";

type Input = {
  skinId: string;
};

const selectSkin = async (
  user: typeof UserDomain,
  accessTokenData: AuthToken | undefined,
  input: Input
) => {
  if (!accessTokenData) {
    throw new AuthenticationError("UNAUTHORIZED");
  }

  await user.selectSkin({
    ...input,
    userId: accessTokenData.userId
  });

  return true;
};

export default selectSkin;
