import {
  buildMock as buildSkinMock,
  buildSkin,
  buildSkinStorageMock,
} from "../../skin/__tests__/skin-factory";
import list from "../list";

const buildMock = ({ skinMock, skinStorageMock }: any = {}) => {
  return {
    Database: buildSkinMock(skinMock),
    SkinStorage: buildSkinStorageMock(skinStorageMock),
  };
};

describe("list()", () => {
  it("calls database and authenticate all images for each skin", async () => {
    const skin = buildSkin();

    const { Database, SkinStorage } = buildMock({
      skinMock: {
        list: jest.fn().mockResolvedValue([skin])
      }
    });

    await list(Database, SkinStorage, {});

    expect(Database.list).toBeCalled();

    expect(SkinStorage.get).toHaveBeenNthCalledWith(1, {
      filename: "location",
      contentType: "image/png",
    });

    expect(SkinStorage.get).toHaveBeenNthCalledWith(2, {
      filename: "location",
      contentType: "image/png",
    });
  });
});