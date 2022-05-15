import signIn from "../sign-in";

import { buildMock as buildAccessTokenMock } from "../../access-token/__tests__/access-token-factory";

import { buildMock as buildUserMock, buildUser } from "./user-factory";

const buildMock = ({ userMock, hashMock, accessTokenMock }: any = {}) => {
  return {
    Database: buildUserMock(userMock),
    Hash: {
      verify: hashMock?.verify || jest.fn(),
      hash: hashMock?.hash || jest.fn()
    },
    AccessToken: buildAccessTokenMock(accessTokenMock)
  };
};

const buildInput = (data?: any) => ({
  email: "email@email.com",
  password: "password",
  ...data,
});

test("should error because user was not found", async () => {
  const input = buildInput();

  const { Database, Hash, AccessToken } = buildMock();

  await expect(signIn(Database, Hash, AccessToken, input)).rejects.toThrowError(
    "Invalid login"
  );
});

test("should error because password is not right", async () => {
  const input = buildInput();

  const { Database, Hash, AccessToken } = buildMock({
    userMock: {
      findBy: jest.fn().mockResolvedValue(buildUser({
        password: "different-password"
      })),
    },
    hashMock: {
      verify: jest.fn().mockResolvedValue(false)
    }
  });

  await expect(signIn(Database, Hash, AccessToken, input)).rejects.toThrowError(
    "Invalid login"
  );

  expect(Hash.verify).toBeCalledWith({
    message: input.password,
    hash: "different-password"
  });
});

test("should return accessToken and refreshToken", async () => {
  const input = buildInput();
  const user = buildUser();

  const { Database, Hash, AccessToken } = buildMock({
    userMock: {
      findBy: jest.fn().mockResolvedValue(user),
    },
    hashMock: {
      verify: jest.fn().mockResolvedValue(true)
    },
    accessTokenMock: {
      create: jest.fn().mockResolvedValue({
        accessToken: "accessToken",
        refreshToken: "refreshToken"
      })
    }
  });

  const response = await signIn(Database, Hash, AccessToken, input);

  expect(AccessToken.create).toBeCalled();

  expect(response).toEqual({
    tokens: {
      accessToken: "accessToken",
      refreshToken: "refreshToken"
    },
    roles: user.roles
  });
});
