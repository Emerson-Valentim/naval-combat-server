import { DateTime } from "luxon";

import verify from "../verify";
import { buildMock as buildSecretMock } from "../../secrets/__tests__/secrets-factory";

import { buildEncryptedToken } from "./access-token-factory";

const buildMock = ({ secretMock }: any = {}) => ({
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

  const { SecretManager } = buildMock({
    secretMock: {
      get: jest.fn().mockResolvedValue(secret),
    },
  });

  const response = await verify(SecretManager, accessToken);

  expect(response).toEqual(tokenData);
});

test("should thrown an error if accessToken is expired", async () => {
  const tokenData = {
    exp: DateTime.now().minus({ hour: 2 }).toMillis() / 1000,
    userId: "user-id",
  };

  const accessToken = buildEncryptedToken(secret, tokenData);

  const { SecretManager } = buildMock({
    secretMock: {
      get: jest.fn().mockResolvedValue(secret),
    },
  });

  await expect(verify(SecretManager, accessToken)).rejects.toThrowError(
    "jwt expired"
  );
});
