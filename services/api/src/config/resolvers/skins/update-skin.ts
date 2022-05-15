import {
  skin as SkinDomain
} from "@naval-combat-server/domains";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";
import { AuthenticationError, ForbiddenError } from "apollo-server";

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
  }
};

const updateSkin = async (
  skin: typeof SkinDomain,
  accessTokenData: AuthToken | undefined,
  input:Input
) => {
  if (!accessTokenData) {
    throw new AuthenticationError("UNAUTHORIZED");
  }

  const { isMaintainer, isAdmin } = roleChecker(accessTokenData);

  if (!isMaintainer && !isAdmin) {
    throw new ForbiddenError("FORBIDDEN");
  }

  await skin.update(input);

  return true;
};

export default updateSkin;
