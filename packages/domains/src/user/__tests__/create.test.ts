import create from "../create";
import { UserInput } from "../ports/database";

import { buildMock as buildUserMock } from "./user-factory";

const buildMock = ({ userMock }: any = {}) => ({
  Database: buildUserMock(userMock),
});

const buildInput = (data?: any): UserInput => ({
  email: "email@email.com",
  password: "password",
  username: "username",
  ...data,
});

beforeEach(jest.clearAllMocks);

test("should call database with right parameters on creation", async () => {
  const input = buildInput();

  const { Database } = buildMock({
    userMock: {
      create: jest.fn(),
    },
  });

  await create(Database, input);

  expect(Database.create).toBeCalledWith(input);
});

test("should thrown an error if email already exists", async () => {
  const input = buildInput();

  const { Database } = buildMock({
    userMock: {
      findBy: jest.fn().mockResolvedValue({
        email: input.email,
        username: "different",
        password: input.password,
      }),
    },
  });

  await expect(create(Database, input)).rejects.toThrowError("Invalid input");
});

test("should thrown an error if username already exists", async () => {
  const input = buildInput();

  const { Database } = buildMock({
    userMock: {
      findBy: jest.fn().mockResolvedValue({
        email: "different@email.com",
        username: input.username,
        password: input.password,
      }),
    },
  });

  await expect(create(Database, input)).rejects.toThrowError(
    "Username is not available"
  );
});
