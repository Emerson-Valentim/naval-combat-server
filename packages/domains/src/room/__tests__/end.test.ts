import end from "../end";
import { RoomStatus } from "../ports/database";

import { buildMock as buildRoomMock, buildRoom } from "./room-factory";

const buildMock = ({ database }: any = {}) => {
  return {
    Database: buildRoomMock(database),
  };
};

describe("end()", () => {
  const room = buildRoom();

  it("calls database and update it to DELETED", async () => {
    const { Database } = buildMock({
      database: {
        findById: jest.fn().mockResolvedValue(room),
      },
    });

    await end(Database, room.id);

    expect(Database.update).toBeCalledWith({
      id: room.id,
      status: RoomStatus.DELETED,
    });
  });

  describe("provides inexistent room", () => {
    it("throws an error", async () => {
      const { Database } = buildMock();

      await expect(end(Database, "id")).rejects.toThrowError("Room not found");
    });
  });
});
