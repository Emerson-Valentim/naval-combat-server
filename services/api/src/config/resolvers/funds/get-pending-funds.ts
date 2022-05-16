import { funds as FundsDomain } from "@naval-combat-server/domains";
import { AuthenticationError, ForbiddenError } from "apollo-server";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";

import { roleChecker } from "../../tools";

const getPendingFunds = async (funds: typeof FundsDomain, accessTokenData: AuthToken | undefined) => {
  if (!accessTokenData) {
    throw new AuthenticationError("UNAUTHORIZED");
  }

  const { isMaintainer, isAdmin } = roleChecker(accessTokenData);

  if (!isMaintainer && !isAdmin) {
    throw new ForbiddenError("FORBIDDEN");
  }

  const pendingFunds = await funds.getPending({});

  return pendingFunds;
};

export default getPendingFunds;
