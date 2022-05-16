import { funds as FundsDomain } from "@naval-combat-server/domains";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";
import { AuthenticationError, ForbiddenError } from "apollo-server";

import { NavalCombatSocket as NavalCombatSocketPort } from "../../../ports/notification";
import { roleChecker } from "../../tools";

type Input = {
  id: string;
};

const approveFunds = async (
  funds: typeof FundsDomain,
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

  await funds.approve(NavalCombatSocket, {
    agentId: accessTokenData.userId,
    id: input.id,
  });

  return true;
};

export default approveFunds;
