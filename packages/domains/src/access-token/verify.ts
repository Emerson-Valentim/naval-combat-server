import { curry } from "ramda";
import jwt from "jsonwebtoken";

import SecretManagerDomain from "../secrets";

import { AuthToken } from "./@types/auth-token";

const verify = async (
  SecretManager: typeof SecretManagerDomain,
  accessToken: string
): Promise<AuthToken> => {
  const secret = await SecretManager.get("access-token-private-key");

  const decryptedToken: AuthToken = await jwt.verify(accessToken, secret) as AuthToken;

  return decryptedToken as AuthToken;
};

export default curry(verify);
