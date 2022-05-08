import { curry } from "ramda";
import jwt from "jsonwebtoken";

import SecretManagerDomain from "../secrets";
import { User } from "../user/ports/database";

import AccessTokenDatabasePort from "./ports/database";

const create = async (
  Database: typeof AccessTokenDatabasePort,
  SecretManager: typeof SecretManagerDomain,
  user: User
) => {
  const oldAccessToken = await Database.findBy(user.id);

  if (oldAccessToken) {
    await Database.remove(user.id);
  }

  const secret = await SecretManager.get("access-token-private-key");

  return await Database.create({
    accessToken: jwt.sign(
      {
        userId: user.id,
        roles: user.roles
      },
      secret,
      {
        expiresIn: "2h",
        noTimestamp: true
      }
    ),
    refreshToken: jwt.sign(
      {
        userId: user.id,
        roles: user.roles
      },
      secret,
      {
        expiresIn: "7d",
        noTimestamp: true
      }
    ),
    userId: user.id,
  });
};

export default curry(create);
