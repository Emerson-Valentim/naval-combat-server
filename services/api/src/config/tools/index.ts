import { accessToken as AccessTokenDomain } from "@naval-combat-server/domains";

import _authenticator from "./authenticator";
import _roleChecker from "./role-checker";
import _logger from "./logger";

export const authenticator = _authenticator(AccessTokenDomain);
export const roleChecker = _roleChecker;
export const logger = _logger;