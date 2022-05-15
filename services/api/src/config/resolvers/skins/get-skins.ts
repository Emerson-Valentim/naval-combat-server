import { skin as SkinDomain } from "@naval-combat-server/domains";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";

const getSkins = async (
  skin: typeof SkinDomain,
  _accessTokenData: AuthToken | undefined
) => {
  const skins = await skin.list({});

  return skins;
};

export default getSkins;
