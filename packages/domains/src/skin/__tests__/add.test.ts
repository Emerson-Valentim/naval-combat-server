import {
  buildMock as buildSkinMock,
  buildSkin,
} from "../../skin/__tests__/skin-factory";
import add from "../add";
import { SkinStatus } from "../ports/skin";

const buildMock = ({ skinMock }: any = {}) => {
  return {
    Database: buildSkinMock(skinMock),
  };
};

const buildInput = (data?: any) => ({
  packageName: "package",
  cost: 10,
  ...data,
});

describe("add()", () => {
  it("provides all parameters and save on database", async () => {
    const input = buildInput({
      packageName: "Package",
    });

    const { Database } = buildMock();

    await add(Database, input);

    expect(Database.findBy).toBeCalledWith(
      "name",
      input.packageName.toLowerCase()
    );

    expect(Database.create).toBeCalledWith({
      name: input.packageName.toLowerCase(),
      cost: input.cost,
      status: SkinStatus.PENDING,
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
});
