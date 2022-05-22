import {
  buildMock as buildSkinMock,
  buildSkin
} from "../../skin/__tests__/skin-factory";
import create from "../create";
import { UserInput } from "../ports/database";

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
  roles: ["user"],
  ...data,
});

beforeEach(jest.clearAllMocks);

describe("create()", () => {
  it("calls database with right parameters on creation for common user", async () => {
    const skin = buildSkin();

    const input = buildInput();

    const { Database, Skin, Socket } = buildMock({
      userMock: {
        create: jest.fn().mockResolvedValue({ id: "user-id"}),
        list: jest.fn().mockResolvedValue([{id: "1"}])
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

  it("calls database with right parameters on creation for first user", async () => {
    const skin = buildSkin();

    const input = buildInput();

    const { Database, Skin, Socket } = buildMock({
      userMock: {
        create: jest.fn().mockResolvedValue({ id: "user-id"}),
        list: jest.fn().mockResolvedValue([])
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
      roles: ["user", "maintainer", "admin"]
    });
  });

  describe("provides email that already exists", () => {
    it("throws an error", async () => {
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
  });

  describe("provides username that already existis", () => {
    it("throws an error", async () => {
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
  });

  describe("default skin not registered", () => {
    test("throws an error", async () => {
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
  });

});
