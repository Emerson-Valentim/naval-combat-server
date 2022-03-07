import { curry } from "ramda";
import jwt from "jsonwebtoken";

import SecretManagerDomain from "../secrets";

import AccessTokenDatabasePort from "./ports/database";

const create = async (
  Database: typeof AccessTokenDatabasePort,
  SecretManager: typeof SecretManagerDomain,
  userId: string
) => {
  const oldAccessToken = await Database.findBy(userId);

  if (oldAccessToken) {
    await Database.remove(userId);
  }

  const secret = await SecretManager.get("access-token-private-key");

  return await Database.create({
    accessToken: jwt.sign(
      {
        userId: userId,
      },
      secret,
      {
        expiresIn: "2h",
        noTimestamp: true
      }
    ),
    refreshToken: jwt.sign(
      {
        userId: userId,
      },
      secret,
      {
        expiresIn: "7d",
        noTimestamp: true
      }
    ),
    userId,
  });
};

export default curry(create);
