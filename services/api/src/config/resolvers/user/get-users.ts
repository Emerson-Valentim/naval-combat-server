import { user as UserDomain } from "@naval-combat-server/domains";
import { AuthenticationError, ForbiddenError } from "apollo-server";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";

import { roleChecker } from "../../tools";

const getUsers = async (user: typeof UserDomain, accessTokenData: AuthToken | undefined) => {
  if (!accessTokenData) {
    throw new AuthenticationError("UNAUTHORIZED");
  }

  const { isMaintainer, isAdmin } = roleChecker(accessTokenData);

  if (!isMaintainer && !isAdmin) {
    throw new ForbiddenError("FORBIDDEN");
  }

  const users = await user.list({});

  return users;
};

export default getUsers;
