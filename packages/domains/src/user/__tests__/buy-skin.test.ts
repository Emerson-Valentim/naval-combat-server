import {
  buildMock as buildSkinMock,
  buildSkin,
} from "../../skin/__tests__/skin-factory";
import buySkin from "../buy-skin";

import {
  buildMock as buildUserMock,
  buildUser,
} from "./user-factory";

const buildMock = ({ skinMock, userMock}: any = {}) => {
  return {
    Database: buildUserMock(userMock),
    Skin: buildSkinMock(skinMock)
  };
};

describe("buySkin()", () => {
  it("updates user with new acquired skin", async () => {
    const user = buildUser();
    const skin = buildSkin();

    const { Database, Skin } = buildMock({
      userMock: {
        findById: jest.fn().mockResolvedValue(user)
      },
      skinMock: {
        get: jest.fn().mockResolvedValue(skin)
      }
    });

    const input = {
      userId: user.id,
      skinId: skin.id
    };

    await buySkin(Database, Skin, input);

    expect(Skin.get).toBeCalledWith(skin.id);

    expect(Database.findById).toBeCalledWith(user.id);

    expect(Skin.buy).toBeCalledWith(input);

    expect(Database.update).toBeCalledWith({
      id: user.id,
      skin: {
        current: user.skin.current,
        available: [...user.skin.available, skin.id]
      }
    });
  });

  describe("provides inexistent skin", () => {
    it("and fails", async () => {
      const { Database, Skin } = buildMock();

      await expect(buySkin(Database, Skin, {
        userId: "id",
        skinId: "id"
      })).rejects.toThrowError("Skin not found");
    });
  });

  describe("provides inexistent user", () => {
    it("and fails", async () => {
      const skin = buildSkin();

      const { Database, Skin } = buildMock({
        skinMock: {
          get: jest.fn().mockResolvedValue(skin)
        }
      });

      await expect(buySkin(Database, Skin, {
        userId: "id",
        skinId: "id"
      })).rejects.toThrowError("User not found");
    });
  });

  describe("provides inexistent user", () => {
    it("and fails", async () => {
      const skin = buildSkin();

      const { Database, Skin } = buildMock({
        skinMock: {
          get: jest.fn().mockResolvedValue(skin)
        }
      });

      await expect(buySkin(Database, Skin, {
        userId: "id",
        skinId: "id"
      })).rejects.toThrowError("User not found");
    });
  });

  describe("provides already bought skin", () => {
    it("and fails", async () => {
      const skin = buildSkin();
      const user = buildUser({
        skin: {
          current: skin.id,
          available: [skin.id]
        }
      });

      const { Database, Skin } = buildMock({
        skinMock: {
          get: jest.fn().mockResolvedValue(skin)
        },
        userMock: {
          findById: jest.fn().mockResolvedValue(user)
        }
      });

      await expect(buySkin(Database, Skin, {
        userId: "id",
        skinId: "id"
      })).rejects.toThrowError("User has already bought this skin");
    });
  });
});