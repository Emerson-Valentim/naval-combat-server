import signIn from "../sign-in";

import { buildMock as buildUserMock, buildUser } from "./user-factory";

const buildMock = ({ userMock, hashMock }: any = {}) => {

  return {
    Database: buildUserMock(userMock),
    Hash: {
      verify: hashMock?.verify || jest.fn(),
      hash: hashMock?.hash || jest.fn()
    },
  };
};

const buildInput = (data?: any) => ({
  email: "email@email.com",
  password: "password",
  ...data,
});

test("should error because user was not found", async () => {
  const input = buildInput();

  const { Database, Hash } = buildMock();

  await expect(signIn(Database, Hash, input)).rejects.toThrowError(
    "Invalid login"
  );
});

test("should error because password is not right", async () => {
  const input = buildInput();

  const { Database, Hash } = buildMock({
    userMock: {
      findBy: jest.fn().mockResolvedValue(buildUser({
        password: "different-password"
      })),
    },
    hashMock: {
      verify: jest.fn().mockResolvedValue(false)
    }
  });

  await expect(signIn(Database, Hash, input)).rejects.toThrowError(
    "Invalid login"
  );

  expect(Hash.verify).toBeCalledWith({
    message: input.password,
    hash: "different-password"
  });
});

test("should return accessToken and refreshToken", async () => {
  const input = buildInput();

  const { Database, Hash } = buildMock({
    userMock: {
      findBy: jest.fn().mockResolvedValue(buildUser()),
    },
    hashMock: {
      verify: jest.fn().mockResolvedValue(true)
    }
  });

  const response = await signIn(Database, Hash, input);

  expect(response).toEqual({
    accessToken: "accessToken",
    refreshToken: "refreshToken"
  });
});
