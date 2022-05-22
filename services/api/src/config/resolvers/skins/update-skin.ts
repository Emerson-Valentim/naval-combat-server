import { skin as SkinDomain } from "@naval-combat-server/domains";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";
import { SkinStatus } from "@naval-combat-server/domains/build/src/skin/ports/skin";
import { AuthenticationError, ForbiddenError } from "apollo-server";

import { NavalCombatSocket as NavalCombatSocketPort } from "../../../ports/notification";
import { roleChecker } from "../../tools";

import { File } from "./add-skin";

type Input = {
  id: string;
  name?: string;
  cost?: number;
  images?: {
    scenario: File;
    avatar: File;
  };
  sounds?: {
    voice: File;
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
