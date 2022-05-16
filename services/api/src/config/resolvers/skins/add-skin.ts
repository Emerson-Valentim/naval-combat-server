import { skin as SkinDomain } from "@naval-combat-server/domains";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";
import { AuthenticationError, ForbiddenError } from "apollo-server";

import { NavalCombatSocket as NavalCombatSocketPort } from "../../../ports/notification";
import { roleChecker } from "../../tools";

export type File = {
  filename: string;
  base64: string;
};

type Input = {
  packageName: string;
  cost: number;
  images: {
    scenario: File;
    avatar: File;
  };
  sounds: {
    voice: File;
  };
};

const addSkin = async (
  skin: typeof SkinDomain,
  NavalCombatSocket: typeof NavalCombatSocketPort,
  accessTokenData: AuthToken | undefined,
  input: Input
) => {
  const skins = await skin.list({});

  if (!skins.length && input.packageName === "default") {
    await skin.add(NavalCombatSocket, input);

    return true;
  }

  if (!accessTokenData) {
    throw new AuthenticationError("UNAUTHORIZED");
  }

  const { isMaintainer, isAdmin } = roleChecker(accessTokenData);

  if (!isMaintainer && !isAdmin) {
    throw new ForbiddenError("FORBIDDEN");
  }

  await skin.add(NavalCombatSocket, input);

  return true;
};

export default addSkin;
