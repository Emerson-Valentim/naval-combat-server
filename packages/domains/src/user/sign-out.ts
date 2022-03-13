import { curry } from "ramda";

import AccessTokenDomain from "../access-token";

const signOut = async (AccessToken: typeof AccessTokenDomain, userId: string) => {
  await AccessToken.revoke(userId);
};

export default curry(signOut);