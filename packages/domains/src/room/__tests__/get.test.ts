import get from "../get";

import { buildMock as buildRoomMock } from "./room-factory";

const buildMock = ({ database }: any = {}) => {
  return {
    Database: buildRoomMock(database),
  };
};

beforeEach(jest.clearAllMocks);

test("should call database and throw an error because room is not found", async () => {
  const { Database } = buildMock();

  await expect(get(Database, "room-id")).rejects.toThrowError("Room not found");

  expect(Database.findById).toBeCalledWith("room-id");
});

test("should call database and return valid room", async () => {
  const { Database } = buildMock({
    database: {
      findById: jest.fn().mockResolvedValue({}),
    },
  });

  const response = await get(Database, "room-id");

  expect(Database.findById).toBeCalledWith("room-id");
  expect(response).toBeDefined();
});
