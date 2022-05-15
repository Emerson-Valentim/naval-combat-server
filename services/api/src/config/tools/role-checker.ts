import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";

const roleChecker = (accessTokenData: AuthToken) => {
  const isMaintainer = accessTokenData.roles.includes("maintainer");

  const isAdmin = accessTokenData.roles.includes("admin");

  return {
    isMaintainer, isAdmin
  };
};

export default roleChecker;