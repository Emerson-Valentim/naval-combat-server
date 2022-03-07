import revoke from "../revoke";

import {
  buildMock as buildAccessTokenMock,
} from "./access-token-factory";

const buildMock = ({ accessTokenMock }: any = {}) => ({
  Database: buildAccessTokenMock(accessTokenMock),
});

beforeEach(jest.clearAllMocks);

test("should delete old token", async () => {
  const { Database } = buildMock();

  await revoke(Database, "user-id");

  expect(Database.remove).toBeCalledWith("user-id");
});