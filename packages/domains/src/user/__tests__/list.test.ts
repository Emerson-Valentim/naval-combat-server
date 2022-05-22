import list from "../list";

import { buildMock as buildUserMock } from "./user-factory";

const buildMock = ({ userMock }: any = {}) => ({
  Database: buildUserMock(userMock),
});

describe("list()", () => {
  it("calls database list", async () => {
    const { Database } = buildMock({
      userMock: {
        list: jest.fn().mockResolvedValue([])
      }
    });

    await list(Database, {});

    expect(Database.list).toBeCalled();
  });
});
