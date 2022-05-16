import {
  buildMock as buildSkinMock,
  buildSkinStorageMock,
  buildSkin,
} from "../../skin/__tests__/skin-factory";
import add from "../add";

const buildMock = ({ skinMock, skinStorageMock }: any = {}) => {
  return {
    Database: buildSkinMock(skinMock),
    SkinStorage: buildSkinStorageMock(skinStorageMock),
    Socket: {
      emit: jest.fn()
    }
  };
};

const buildInput = (data?: any) => ({
  packageName: "package",
  images: {
    avatar: {
      filename: "avatar.png",
      base64: "base64",
    },
    scenario: {
      filename: "scenario.png",
      base64: "base64",
    },
  },
  sounds: {
    voice: {
      filename: "voice.mp3",
      base64: "base64",
    },
  },
  cost: 10,
  ...data,
});

describe("add()", () => {
  it("provides all parameters and save on database", async () => {
    const input = buildInput({
      packageName: "Package",
    });

    const { Database, SkinStorage, Socket } = buildMock({
      skinStorageMock: {
        add: jest
          .fn()
          .mockResolvedValueOnce("package/avatar.png")
          .mockResolvedValueOnce("package/scenario.png")
          .mockResolvedValueOnce("package/voice.mp3"),
      },
    });

    await add(Database, SkinStorage, Socket, input);

    expect(Database.findBy).toBeCalledWith(
      "name",
      input.packageName.toLowerCase()
    );

    expect(SkinStorage.add).toHaveBeenNthCalledWith(1, {
      location: "package/avatar.png",
      base64: "base64",
      contentType: "image/png",
    });

    expect(SkinStorage.add).toHaveBeenNthCalledWith(2, {
      location: "package/scenario.png",
      base64: "base64",
      contentType: "image/png",
    });

    expect(SkinStorage.add).toHaveBeenNthCalledWith(3, {
      location: "package/voice.mp3",
      base64: "base64",
      contentType: "audio/mp3",
    });

    expect(Database.create).toBeCalledWith({
      name: input.packageName.toLowerCase(),
      cost: input.cost,
      images: {
        avatar: {
          location: "package/avatar.png",
          name: "avatar.png",
        },
        scenario: {
          location: "package/scenario.png",
          name: "scenario.png",
        },
      },
      sounds: {
        voice: {
          location: "package/voice.mp3",
          name: "voice.mp3",
        },
      },
    });
  });

  describe("provides existing skin name", () => {
    it("and fail", async () => {
      const input = buildInput();

      const { Database, SkinStorage, Socket } = buildMock({
        skinMock: {
          findBy: jest.fn().mockResolvedValue(
            buildSkin({
              name: input.packageName,
            })
          ),
        },
      });

      await expect(add(Database, SkinStorage, Socket, input)).rejects.toThrowError(
        "There is already a package with this name"
      );
    });
  });

  describe("provides forbidden file extension", () => {
    it("and fail", async () => {
      const input = buildInput({
        images: {
          avatar: {
            filename: "invalid.exe",
            base64: "base64",
          },
        },
      });

      const { Database, SkinStorage, Socket } = buildMock();

      await expect(add(Database, SkinStorage, Socket, input)).rejects.toThrowError(
        "Extension is not allowed"
      );
    });
  });
});
