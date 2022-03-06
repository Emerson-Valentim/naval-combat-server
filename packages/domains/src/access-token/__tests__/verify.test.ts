import { DateTime } from "luxon";

import verify from "../verify";
import { buildMock as buildSecretMock } from "../../secrets/__tests__/secrets-factory";

import { buildEncryptedToken ,
  buildMock as buildAccessTokenMock,
} from "./access-token-factory";

const buildMock = ({ accessTokenMock, secretMock }: any = {}) => ({
  Database: buildAccessTokenMock(accessTokenMock),
  SecretManager: buildSecretMock(secretMock),
});

beforeEach(jest.clearAllMocks);

const secret = "secret-token";

test("should return deserialized token with user information", async () => {
  const tokenData = {
    exp: DateTime.now().plus({ hour: 2 }).toMillis(),
    userId: "user-id",
  };

  const accessToken = buildEncryptedToken(secret, tokenData);

  const { Database, SecretManager } = buildMock({
    secretMock: {
      get: jest.fn().mockResolvedValue(secret),
    },
    accessTokenMock: {
      findBy: jest.fn().mockResolvedValue({
        accessToken: accessToken
      })
    }
  });

  const response = await verify(Database, SecretManager, accessToken);

  expect(response).toEqual(tokenData);
});

test("should thrown an error if accessToken is expired", async () => {
  const tokenData = {
    exp: DateTime.now().minus({ hour: 2 }).toMillis() / 1000,
    userId: "user-id",
  };

  const accessToken = buildEncryptedToken(secret, tokenData);

  const { Database, SecretManager } = buildMock({
    secretMock: {
      get: jest.fn().mockResolvedValue(secret),
    },
  });

  await expect(verify(Database, SecretManager, accessToken)).rejects.toThrowError(
    "jwt expired"
  );
});

test("should thrown an error if accessToken is not the one on database", async () => {
  const tokenData = {
    exp: DateTime.now().plus({ hour: 2 }).toMillis() / 1000,
    userId: "user-id",
  };

  const accessToken = buildEncryptedToken(secret, tokenData);

  const { Database, SecretManager } = buildMock({
    secretMock: {
      get: jest.fn().mockResolvedValue(secret),
    },
    accessTokenMock: {
      findBy: jest.fn().mockResolvedValue({
        accessToken: "invalid-access-token"
      })
    }
  });

  await expect(verify(Database, SecretManager, accessToken)).rejects.toThrowError(
    "Token is not valid"
  );
});
