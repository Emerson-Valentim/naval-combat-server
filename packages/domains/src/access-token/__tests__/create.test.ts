import create from "../create";
import { buildMock as buildSecretMock } from "../../secrets/__tests__/secrets-factory";

import { buildUser } from "../../user/__tests__/user-factory";

import { buildMock as buildAccessTokenMock } from "./access-token-factory";

const buildMock = ({ accessTokenMock, secretMock }: any = {}) => ({
  Database: buildAccessTokenMock(accessTokenMock),
  SecretManager: buildSecretMock(secretMock),
});

beforeEach(jest.clearAllMocks);

const user = buildUser();

test("should delete old token", async () => {
  const { Database, SecretManager } = buildMock({
    accessTokenMock: {
      findBy: jest.fn().mockResolvedValue(buildAccessTokenMock()),
      remove: jest.fn().mockResolvedValue(null),
    },
    secretMock: {
      get: jest.fn().mockResolvedValue("value"),
    },
  });

  await create(Database, SecretManager, user);

  expect(Database.findBy).toBeCalledWith(user.id);
  expect(Database.remove).toBeCalledWith(user.id);
});

test("should save document at table", async () => {
  const document = buildAccessTokenMock();

  const { Database, SecretManager } = buildMock({
    accessTokenMock: {
      create: jest.fn().mockResolvedValue(document),
    },
    secretMock: {
      get: jest.fn().mockResolvedValue("value"),
    },
  });

  await create(Database, SecretManager, user);

  expect(Database.create).toBeCalledWith({
    accessToken: expect.any(String),
    refreshToken: expect.any(String),
    userId: user.id,
  });
});
