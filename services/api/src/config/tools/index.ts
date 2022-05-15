import { accessToken as AccessTokenDomain } from "@naval-combat-server/domains";

import _authenticator from "./authenticator";
import _roleChecker from "./role-checker";

export const authenticator = _authenticator(AccessTokenDomain);
export const roleChecker = _roleChecker;