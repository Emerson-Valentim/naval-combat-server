import { user as UserDomain } from "@naval-combat-server/domains";
import { AuthToken, Roles } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";
import { ForbiddenError } from "apollo-server";

import { roleChecker } from "../../tools";

type Input = {
  userId: string
  roles: Roles[]
}

const updateRoles = async (user: typeof UserDomain, accessTokenData: AuthToken | undefined, input: Input) => {
  if(!accessTokenData) {
    throw new ForbiddenError("FORBIDDEN");
  }

  const { isMaintainer, isAdmin } = roleChecker(accessTokenData);

  if (!isMaintainer && !isAdmin) {
    throw new ForbiddenError("FORBIDDEN");
  }

  await user.updateRoles({
    ...input,
    agentId: accessTokenData.userId
  });

  return true;
};

export default updateRoles;
