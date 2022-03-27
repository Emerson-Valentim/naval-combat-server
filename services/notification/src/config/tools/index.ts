import {
  accessToken as AccessTokenDomain,
  user as UserDomain,
} from "@naval-combat-server/domains";

import _authenticator from "./authenticator";
import _IOHandler from "./io-handler";

export const authenticator = _authenticator(AccessTokenDomain, UserDomain);
export const IOHandler = _IOHandler;
