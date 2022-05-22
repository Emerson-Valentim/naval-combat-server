import {
  buildMock as buildSkinMock, buildSkin
} from "../../skin/__tests__/skin-factory";
import add from "../add";

const buildMock = ({ skinMock }: any = {}) => {
  return {
    Database: buildSkinMock(skinMock),
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

    const { Database } = buildMock({
      skinStorageMock: {
        add: jest
          .fn()
          .mockResolvedValueOnce("package/avatar.png")
          .mockResolvedValueOnce("package/scenario.png")
          .mockResolvedValueOnce("package/voice.mp3"),
      },
    });

    await add(Database, input);

    expect(Database.findBy).toBeCalledWith(
      "name",
      input.packageName.toLowerCase()
    );

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

      const { Database } = buildMock({
        skinMock: {
          findBy: jest.fn().mockResolvedValue(
            buildSkin({
              name: input.packageName,
            })
          ),
        },
      });

      await expect(add(Database, input)).rejects.toThrowError(
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

      const { Database } = buildMock();

      await expect(add(Database, input)).rejects.toThrowError(
        "Extension is not allowed"
      );
    });
  });
});
