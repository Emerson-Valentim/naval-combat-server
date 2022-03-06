import jwt from "jsonwebtoken";

import { AccessToken } from "../ports/database";

export const buildMock = (accessTokenFactory?: any) => {
  const mock = {
    ...jest.requireMock("../ports/database"),
  }.default;

  return {
    ...mock,
    ...jest.requireMock("../").default,
    ...accessTokenFactory,
  };
};

export const buildAccessToken = (data?: any): AccessToken => {
  return {
    accessToken: "accessToken",
    refreshToken: "refreshToken",
    userId: "userId",
    ...data,
  };
};

export const buildEncryptedToken = (
  secret: string,
  data: any,
  expiresIn?: "7d" | "2h"
) =>
  jwt.sign(
    data,
    secret,
    expiresIn ? { expiresIn, noTimestamp: true } : { noTimestamp: true }
  );
