import {
  skin as SkinDomain,
  user as UserDomain,
} from "@naval-combat-server/domains";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";
import { AuthenticationError } from "apollo-server";

const getSkin = async (
  skin: typeof SkinDomain,
  user: typeof UserDomain,
  _accessTokenData: AuthToken | undefined
) => {
  if (!_accessTokenData) {
    throw new AuthenticationError("UNAUTHORIZED");
  }

  const currentUser = await user.get(_accessTokenData?.userId, "id");

  const currentSkin = await skin.get(currentUser.skin.current);

  return {
    current: currentSkin,
    available: currentUser.skin.available,
  };
};

export default getSkin;
