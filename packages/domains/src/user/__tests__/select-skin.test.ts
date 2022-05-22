import selectSkin from "../select-skin";

import { buildMock as buildSkinMock } from "../../skin/__tests__/skin-factory";

import { buildMock as buildUserMock, buildUser } from "./user-factory";

const buildMock = ({ userMock, skinMock }: any = {}) => ({
  Database: buildUserMock(userMock),
  Skin: buildSkinMock(skinMock),
});

describe("selectSkin()", () => {
  const user = buildUser();
  const input = { userId: user.id, skinId: user.skin.current };

  it("provides a skinId and updates on database", async () => {
    const { Database, Skin } = buildMock({
      userMock: {
        findById: jest.fn().mockResolvedValue(user),
      },
      skinMock: {
        get: jest.fn().mockResolvedValue({ id: "skin" }),
      },
    });

    await selectSkin(Database, Skin, input);

    expect(Database.update).toBeCalledWith({
      id: user.id,
      skin: {
        ...user.skin,
        current: input.skinId,
      },
    });
  });

  describe("provide a user that not exists", () => {
    it("throws an error", async () => {
      const { Database, Skin } = buildMock();

      await expect(selectSkin(Database, Skin, input)).rejects.toThrowError(
        "User not found"
      );
    });
  });

  describe("provides a skin that not exists", () => {
    it("throws an error", async () => {
      const { Database, Skin } = buildMock({
        userMock: {
          findById: jest.fn().mockResolvedValue(user),
        },
      });

      await expect(selectSkin(Database, Skin, input)).rejects.toThrowError(
        "Skin not found"
      );
    });
  });

  describe("provides a skin that user doesn't have", () => {
    it("throws an error", async () => {
      const { Database, Skin } = buildMock({
        userMock: {
          findById: jest.fn().mockResolvedValue(user),
        },
        skinMock: {
          get: jest.fn().mockResolvedValue({ id: "unknown-skin" }),
        },
      });

      await expect(selectSkin(Database, Skin, {
        userId: user.id,
        skinId: "unknown-skin"
      })).rejects.toThrowError(
        "Skin is not available for user"
      );
    });
  });
});
