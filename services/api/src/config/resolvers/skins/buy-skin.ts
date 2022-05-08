import { user as UserDomain } from "@naval-combat-server/domains";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";
import { AuthenticationError } from "apollo-server";

type Input = {
  skinId: string;
};

const buySkin = async (
  user: typeof UserDomain,
  accessTokenData: AuthToken | undefined,
  input: Input
) => {
  if (!accessTokenData?.userId) {
    throw new AuthenticationError("UNAUTHORIZED");
  }

  await user.buySkin({
    userId: accessTokenData.userId,
    skinId: input.skinId,
  });

  return true;
};

export default buySkin;
