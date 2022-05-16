import create from "../create";
import { UserInput } from "../ports/database";
import {
  buildMock as buildSkinMock,
  buildSkin,
} from "../../skin/__tests__/skin-factory";

import { buildMock as buildUserMock } from "./user-factory";

const buildMock = ({ userMock, skinMock }: any = {}) => ({
  Database: buildUserMock(userMock),
  Skin: buildSkinMock(skinMock),
  Socket: {
    emit: jest.fn()
  }
});

const buildInput = (data?: any): UserInput => ({
  email: "email@email.com",
  password: "password",
  username: "username",
  ...data,
});

beforeEach(jest.clearAllMocks);

test("should call database with right parameters on creation", async () => {
  const skin = buildSkin();

  const input = buildInput();

  const { Database, Skin, Socket } = buildMock({
    userMock: {
      create: jest.fn().mockResolvedValue({ id: "user-id"}),
    },
    skinMock: {
      getDefault: jest.fn().mockResolvedValue(skin),
    },
  });

  await create(Database, Skin, Socket, input);

  expect(Database.create).toBeCalledWith({
    ...input,
    skin: {
      available: [skin.id],
      current: skin.id,
    },
  });
});

test("should thrown an error if email already exists", async () => {
  const input = buildInput();

  const { Database, Skin, Socket } = buildMock({
    userMock: {
      findBy: jest.fn().mockResolvedValue({
        email: input.email,
        username: "different",
        password: input.password,
      }),
    },
  });

  await expect(create(Database, Skin, Socket, input)).rejects.toThrowError(
    "Invalid input"
  );
});

test("should thrown an error if username already exists", async () => {
  const input = buildInput();

  const { Database, Skin, Socket } = buildMock({
    userMock: {
      findBy: jest.fn().mockResolvedValue({
        email: "different@email.com",
        username: input.username,
        password: input.password,
      }),
    },
  });

  await expect(create(Database, Skin, Socket, input)).rejects.toThrowError(
    "Username is not available"
  );
});

test("should thrown an error if default skin is not registered", async () => {
  const input = buildInput();

  const { Database, Skin, Socket } = buildMock({
    userMock: {
      create: jest.fn(),
    },
    skinMock: {
      getDefault: jest.fn().mockResolvedValue(undefined),
    },
  });

  await expect(create(Database, Skin, Socket, input)).rejects.toThrowError(
    "Default skin is not registered"
  );
});
