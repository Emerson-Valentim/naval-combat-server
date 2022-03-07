import { DateTime } from "luxon";

import refresh from "../refresh";
import { buildMock as buildSecretMock } from "../../secrets/__tests__/secrets-factory";

import {
  buildMock as buildAccessTokenMock,
  buildEncryptedToken,
} from "./access-token-factory";

const buildMock = ({ accessTokenMock, secretMock }: any = {}) => ({
  Database: buildAccessTokenMock(accessTokenMock),
  SecretManager: buildSecretMock(secretMock),
});

beforeEach(jest.clearAllMocks);

const secret = "secret-token";

test("should throw an error because refresh token is expired", async () => {
  const refreshToken = buildEncryptedToken(secret, {
    userId: "user-id",
    exp: DateTime.now().minus({ days: 7 }).toMillis() / 1000,
  });

  const { Database, SecretManager } = buildMock({
    secretMock: {
      get: jest.fn().mockResolvedValue(secret),
    },
  });

  await expect(
    refresh(Database, SecretManager, refreshToken)
  ).rejects.toThrowError("jwt expired");
});

test("should create a new token on refresh", async () => {
  const refreshToken = buildEncryptedToken(
    secret,
    {
      userId: "user-id",
    },
    "7d"
  );

  const { Database, SecretManager } = buildMock({
    secretMock: {
      get: jest.fn().mockResolvedValue(secret),
    },
    accessTokenMock: {
      findBy: jest.fn().mockResolvedValue({
        refreshToken
      })
    }
  });

  await refresh(Database, SecretManager, refreshToken);

  expect(Database.remove).toBeCalledWith("user-id");
  expect(Database.create).toBeCalledWith({
    accessToken: expect.any(String),
    refreshToken: expect.any(String),
    userId: "user-id",
  });
});

test("should thrown an error because refreshToken is not the one on database", async () => {
  const refreshToken = buildEncryptedToken(
    secret,
    {
      userId: "user-id",
    },
    "7d"
  );

  const { Database, SecretManager } = buildMock({
    secretMock: {
      get: jest.fn().mockResolvedValue(secret),
    },
    accessTokenMock: {
      findBy: jest.fn().mockResolvedValue({
        refreshToken: "invalid-refresh-token"
      })
    }
  });

  await expect(
    refresh(Database, SecretManager, refreshToken)
  ).rejects.toThrowError("Token is not valid");
});
