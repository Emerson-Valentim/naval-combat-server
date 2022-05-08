import {
  buildMock as buildSkinMock,
  buildSkin,
  buildSkinUsageMock,
} from "../../skin/__tests__/skin-factory";
import remove from "../remove";

const buildMock = ({ skinMock, skinUsageMock }: any = {}) => {
  return {
    SkinDatabase: buildSkinMock(skinMock),
    SkinUsageDatabase: buildSkinUsageMock(skinUsageMock),
  };
};

describe("remove()", () => {
  beforeEach(jest.clearAllMocks);

  it("deletes skin from database", async () => {
    const skin = buildSkin();

    const { SkinDatabase, SkinUsageDatabase } = buildMock({
      skinMock: {
        findById: jest.fn().mockResolvedValue(skin),
      },
    });

    await remove(SkinDatabase, SkinUsageDatabase, {
      skinId: "id",
    });

    expect(SkinUsageDatabase.list).toBeCalledWith("id");

    expect(SkinDatabase.findById).toBeCalledWith("id");

    expect(SkinDatabase.remove).toBeCalledWith("id");
  });

  describe("provides already sold skin", () => {
    it("and fails", async () => {
      const { SkinDatabase, SkinUsageDatabase } = buildMock({
        skinUsageMock: {
          list: jest.fn().mockResolvedValue([
            {
              userId: "id",
              skinId: "id",
            },
          ]),
        },
      });

      await expect(
        remove(SkinDatabase, SkinUsageDatabase, {
          skinId: "id",
        })
      ).rejects.toThrowError("There is users with skin");
    });
  });

  describe("provides inexistent skin", () => {
    it("and fails", async () => {
      const { SkinDatabase, SkinUsageDatabase } = buildMock();

      await expect(
        remove(SkinDatabase, SkinUsageDatabase, {
          skinId: "id",
        })
      ).rejects.toThrowError("Skin not found");
    });
  });

  describe("provides default skin", () => {
    it("and fails", async () => {
      const { SkinDatabase, SkinUsageDatabase } = buildMock({
        skinMock: {
          findById: jest.fn().mockResolvedValue({
            name: "default",
          }),
        },
      });

      await expect(
        remove(SkinDatabase, SkinUsageDatabase, {
          skinId: "id",
        })
      ).rejects.toThrowError("Default skin can not be deleted");
    });
  });
});
