import { skin as SkinDomain } from "@naval-combat-server/domains";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";

type Input = {
  skinId: string;
};

const removeSkin = async (
  skin: typeof SkinDomain,
  _accessTokenData: AuthToken | undefined,
  input: Input
) => {
  // if (!accessTokenData?.userId) {
  //   throw new AuthenticationError("UNAUTHORIZED");
  // }

  await skin.remove({
    skinId: input.skinId,
  });

  return true;
};

export default removeSkin;
