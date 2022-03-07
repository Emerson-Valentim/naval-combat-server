import { curry } from "ramda";
import jwt from "jsonwebtoken";

import SecretManagerDomain from "../secrets";

import AccessTokenDatabasePort from "./ports/database";
import { AuthToken } from "./@types/auth-token";

const verify = async (
  Database: typeof AccessTokenDatabasePort,
  SecretManager: typeof SecretManagerDomain,
  accessToken: string
): Promise<AuthToken> => {
  const secret = await SecretManager.get("access-token-private-key");

  const decryptedToken: AuthToken = (await jwt.verify(
    accessToken,
    secret
  )) as AuthToken;

  const currentToken = await Database.findBy(decryptedToken.userId);

  if (currentToken.accessToken !== accessToken) {
    throw new Error("Token is not valid");
  }

  return decryptedToken as AuthToken;
};

export default curry(verify);
