import {
  buildSkinUsageMock,
} from "../../skin/__tests__/skin-factory";
import buy from "../buy";

const buildMock = ({ skinUsageMock }: any = {}) => {
  return {
    SkinUsageDatabase: buildSkinUsageMock(skinUsageMock),
  };
};

describe("buy()", () => {
  it("calls database and add new document", async () => {
    const { SkinUsageDatabase } = buildMock();

    await buy(SkinUsageDatabase, {
      userId: "user-id",
      skinId: "skin-id"
    });

    expect(SkinUsageDatabase.create).toBeCalledWith({
      userId: "user-id",
      skinId: "skin-id"
    });
  });
});