import {
  buildMock as buildSkinMock,
  buildSkin,
} from "../../skin/__tests__/skin-factory";
import getDefault from "../get-default";

const buildMock = ({ skinMock }: any = {}) => {
  return {
    Database: buildSkinMock(skinMock),
  };
};

describe("getDefault()", () => {
  beforeEach(jest.clearAllMocks);

  it("returns default skin", async () => {
    const skin = buildSkin();

    const { Database } = buildMock({
      skinMock: {
        findBy: jest.fn().mockResolvedValue(skin),
      },
    });

    await getDefault(Database, {});

    expect(Database.findBy).toBeCalledWith("name", "default");
  });

  describe("has no default skin registered", () => {
    it("and fails", async () => {
      const { Database } = buildMock();

      await expect(getDefault(Database, {})).rejects.toThrowError(
        "Default skin is not available"
      );
    });
  });
});
