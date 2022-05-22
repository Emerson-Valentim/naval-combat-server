import { skin as SkinDomain } from "@naval-combat-server/domains";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";
import { SkinImageSection, SkinSoundSection, SkinStatus } from "@naval-combat-server/domains/build/src/skin/ports/skin";
import { IncomingFile } from "@naval-combat-server/domains/build/src/skin/utils/save-files";
import { AuthenticationError, ForbiddenError } from "apollo-server";

import { NavalCombatSocket as NavalCombatSocketPort } from "../../../ports/notification";
import { roleChecker } from "../../tools";

type Input = {
  id: string;
  name?: string;
  cost?: number;
  images?: {
    [key in SkinImageSection]?: IncomingFile;
  };
  sounds?: {
    [key in SkinSoundSection]?: IncomingFile;
  };
  status?: SkinStatus
};

const updateSkin = async (
  skin: typeof SkinDomain,
  NavalCombatSocket: typeof NavalCombatSocketPort,
  accessTokenData: AuthToken | undefined,
  input: Input
) => {
  if (!accessTokenData) {
    throw new AuthenticationError("UNAUTHORIZED");
  }

  const { isMaintainer, isAdmin } = roleChecker(accessTokenData);

  if (!isMaintainer && !isAdmin) {
    throw new ForbiddenError("FORBIDDEN");
  }

  await skin.update(NavalCombatSocket, input);

  return true;
};

export default updateSkin;
