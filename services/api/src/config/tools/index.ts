import { accessToken as AccessTokenDomain } from "@naval-combat-server/domains";

import _authenticator from "./authenticator";

export const authenticator = _authenticator(AccessTokenDomain);