import { funds as FundsDomain, user } from "@naval-combat-server/domains";
import { AuthenticationError, ForbiddenError } from "apollo-server";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";

import { roleChecker } from "../../tools";

type Input = {
  id: string
}

const approveFunds = async (funds: typeof FundsDomain, accessTokenData: AuthToken | undefined, input: Input) => {
  if (!accessTokenData) {
    throw new AuthenticationError("UNAUTHORIZED");
  }

  const { isMaintainer, isAdmin } = roleChecker(accessTokenData);

  if (!isMaintainer && !isAdmin) {
    throw new ForbiddenError("FORBIDDEN");
  }

  await funds.approve({
    agentId: accessTokenData.userId,
    id: input.id
  });

  return true;
};

export default approveFunds;
