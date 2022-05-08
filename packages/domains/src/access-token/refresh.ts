import { curry } from "ramda";
import jwt from "jsonwebtoken";

import SecretManagerDomain from "../secrets";

import AccessTokenDatabasePort from "./ports/database";
import { AuthToken } from "./@types/auth-token";

const refresh = async (
  Database: typeof AccessTokenDatabasePort,
  SecretManager: typeof SecretManagerDomain,
  refreshToken: string
) => {
  const secret = await SecretManager.get("access-token-private-key");

  const decryptedToken: AuthToken = (await jwt.verify(
    refreshToken,
    secret
  )) as AuthToken;

  const currentToken = await Database.findBy(decryptedToken.userId);

  const isTokenValid = currentToken && currentToken?.refreshToken === refreshToken;

  if (!currentToken || !isTokenValid) {
    throw new Error("Token is not valid");
  }

  await Database.remove(decryptedToken.userId);

  return Database.create({
    accessToken: jwt.sign(
      {
        userId: decryptedToken.userId,
        roles: decryptedToken.roles,
      },
      secret,
      {
        expiresIn: "2h",
        noTimestamp: true
      }
    ),
    refreshToken: jwt.sign(
      {
        userId: decryptedToken.userId,
        roles: decryptedToken.roles,
      },
      secret,
      {
        expiresIn: "7d",
        noTimestamp: true
      }
    ),
    userId: decryptedToken.userId,
  });
};

export default curry(refresh);
