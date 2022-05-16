import { user as UserDomain } from "@naval-combat-server/domains";
import {
  AuthToken,
  Roles,
} from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";
import { ForbiddenError } from "apollo-server";

import { NavalCombatSocket as NavalCombatSocketPort } from "../../../ports/notification";
import { roleChecker } from "../../tools";

type Input = {
  userId: string;
  roles: Roles[];
};

const updateRoles = async (
  user: typeof UserDomain,
  NavalCombatSocket: typeof NavalCombatSocketPort,
  accessTokenData: AuthToken | undefined,
  input: Input
) => {
  if (!accessTokenData) {
    throw new ForbiddenError("FORBIDDEN");
  }

  const { isMaintainer, isAdmin } = roleChecker(accessTokenData);

  if (!isMaintainer && !isAdmin) {
    throw new ForbiddenError("FORBIDDEN");
  }

  await user.updateRoles(NavalCombatSocket, {
    ...input,
    agentId: accessTokenData.userId,
  });

  return true;
};

export default updateRoles;
