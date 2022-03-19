import {
  accessToken as AccessTokenDomain,
  user as UserDomain,
} from "@naval-combat-server/domains";

import _authenticator from "./authenticator";

export const authenticator = _authenticator(AccessTokenDomain, UserDomain);
