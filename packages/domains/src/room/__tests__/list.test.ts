import list from "../list";
import { RoomStatus, RoomType } from "../ports/database";

import { buildMock as buildRoomMock } from "./room-factory";

const buildMock = ({ database }: any = {}) => {
  return {
    Database: buildRoomMock(database),
  };
};

test("should filter all rooms that is not PRIVATE or DELETED", async() => {

  const { Database } = buildMock();

  await list(Database, {});

  expect(Database.findBy).toBeCalledWith({
    status: {
      $ne: RoomStatus.DELETED,
    },
    type: {
      $ne: RoomType.PRIVATE,
    },
  });
});