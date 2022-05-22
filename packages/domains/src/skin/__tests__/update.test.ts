import {
  buildMock as buildSkinMock,
  buildSkin,
  buildSkinStorageMock,
} from "../../skin/__tests__/skin-factory";
import update from "../update";

const buildMock = ({ skinMock, skinStorageMock }: any = {}) => {
  return {
    Database: buildSkinMock(skinMock),
    SkinStorage: buildSkinStorageMock(skinStorageMock),
    Socket: {
      emit: jest.fn(),
    },
  };
};

describe("update()", () => {
  const skin = buildSkin();
  const input = {
    id: skin.id,
    name: "new-name",
  };

  it("calls database with new name", async () => {
    const { Database, SkinStorage, Socket } = buildMock({
      skinMock: {
        findById: jest.fn().mockResolvedValue(skin),
      },
    });

    await update(Database, SkinStorage, Socket, input);

    expect(Database.update).toBeCalledWith({
      ...skin,
      name: input.name,
    });

    expect(Socket.emit).toBeCalledWith({
      channel: "server:skin:update",
      message: { id: skin.id },
    });
  });

  it("deletes old files and create new ones", async () => {
    const { Database, SkinStorage, Socket } = buildMock({
      skinMock: {
        findById: jest.fn().mockResolvedValue(skin),
      },
      skinStorageMock: {
        add: jest.fn().mockResolvedValue("location-scenario-2"),
      },
    });

    await update(Database, SkinStorage, Socket, {
      ...input,
      images: {
        scenario: {
          base64: "new-base64",
          filename: skin.images?.scenario.name ?? "",
        },
      },
    });

    expect(SkinStorage.add).toHaveBeenNthCalledWith(1, {
      base64: "new-base64",
      contentType: "image/png",
      location: "new-name/name.png",
    });

    expect(SkinStorage.remove).toHaveBeenNthCalledWith(1, {
      location: "location-scenario",
    });
  });

  describe("provides inexistent skin", () => {
    it("throws an error", async () => {
      const { Database, SkinStorage, Socket } = buildMock();

      await expect(
        update(Database, SkinStorage, Socket, input)
      ).rejects.toThrowError("Skin not found");
    });
  });

  describe("provides new name for default skin", () => {
    it("throws an error", async () => {
      const { Database, SkinStorage, Socket } = buildMock({
        skinMock: {
          findById: jest.fn().mockResolvedValue({
            ...skin,
            name: "default"
          })
        }
      });

      await expect(
        update(Database, SkinStorage, Socket, input)
      ).rejects.toThrowError("Default skin name is not updatable");
    });
  });
});
