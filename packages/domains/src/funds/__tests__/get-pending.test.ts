import getPending from "../get-pending";

import { buildMock as buildUserMock } from "../../user/__tests__/user-factory";

import { FundsStatus } from "../ports/database";

import { buildSkin } from "../../skin/__tests__/skin-factory";

import { buildMock as buildFundsMock } from "./funds-factory";

const buildMock = ({ fundsMock, userMock }: any = {}) => {
  return {
    Database: buildFundsMock(fundsMock),
    User: buildUserMock(userMock),
  };
};

describe("getPending()", () => {
  const skin = buildSkin();

  it("calls database and add username for each fund", async () => {
    const { Database, User } = buildMock({
      fundsMock: {
        findBy: jest.fn().mockResolvedValue([skin]),
      },
      userMock: {
        get: jest.fn().mockResolvedValue({ username: "username" })
      },
    });

    await getPending(Database, User, {});

    expect(
      Database.findBy({
        status: {
          $ne: FundsStatus.CREDITED,
        },
      })
    );

    expect(User.get).toBeCalledTimes(1);
  });
});
