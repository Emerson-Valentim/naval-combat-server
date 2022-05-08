import {
  buildMock as buildSkinMock,
  buildSkin,
  buildSkinStorageMock,
} from "../../skin/__tests__/skin-factory";
import get from "../get";

const buildMock = ({ skinMock, skinStorageMock }: any = {}) => {
  return {
    Database: buildSkinMock(skinMock),
    SkinStorage: buildSkinStorageMock(skinStorageMock),
  };
};

describe("get()", () => {
  beforeEach(jest.clearAllMocks);

  it("returns authenticated images", async () => {
    const skin = buildSkin();

    const { Database, SkinStorage } = buildMock({
      skinMock: {
        findById: jest.fn().mockResolvedValue(skin),
      },
      skinStorage: {
        get: jest.fn().mockResolvedValue("signed.url"),
      },
    });

    await get(Database, SkinStorage, "id");

    expect(Database.findById).toBeCalledWith("id");

    expect(SkinStorage.get).toHaveBeenNthCalledWith(1, {
      filename: "location",
      contentType: "image/png",
    });

    expect(SkinStorage.get).toHaveBeenNthCalledWith(2, {
      filename: "location",
      contentType: "image/png",
    });
  });

  describe("has no default skin registered", () => {
    it("and fails", async () => {
      const { Database, SkinStorage } = buildMock();

      await expect(get(Database, SkinStorage, "id")).rejects.toThrowError(
        "Skin not found"
      );
    });
  });
});
