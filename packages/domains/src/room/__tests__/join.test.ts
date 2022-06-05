import { buildMock as buildBoardMock } from "../../board/__tests__/board-factory";
import join from "../join";

import { buildMock as buildRoomMock, buildRoom } from "./room-factory";

const buildMock = ({ database }: any = {}) => {
  return {
    Database: buildRoomMock(database),
    Socket: {
      emit: jest.fn().mockResolvedValue(true),
    },
    Board: buildBoardMock()
  };
};

beforeEach(jest.clearAllMocks);

test("should throw an error because room does not exist", async () => {
  const { Database, Board, Socket } = buildMock();

  await expect(
    join(Database, Board, Socket, {
      roomId: "room-id",
      userId: "user-id",
    })
  ).rejects.toThrowError("Room not found");

  expect(Database.findById).toBeCalledWith("room-id");
});

test("should throw an error because room is full", async () => {
  const { Database, Board, Socket } = buildMock({
    database: {
      findById: jest.fn().mockResolvedValue(
        buildRoom({
          limit: 1,
        })
      ),
    },
  });

  await expect(
    join(Database, Board, Socket, {
      roomId: "room-id",
      userId: "user-id2",
    })
  ).rejects.toThrowError("Room is full");
});

test("should not update room if user is already on room", async () => {
  const { Database, Board, Socket } = buildMock({
    database: {
      findById: jest.fn().mockResolvedValue(
        buildRoom({
          limit: 2,
        })
      ),
    },
  });

  await join(Database, Board, Socket, {
    roomId: "room-id",
    userId: "user-id",
  });

  expect(Database.update).not.toBeCalled();
});

test("should update room with new user and emit a socket", async () => {
  const room = buildRoom({
    limit: 2,
  });

  const input = {
    roomId: "room-id",
    userId: "user-id2",
  };

  const { Database, Board, Socket } = buildMock({
    database: {
      findById: jest.fn().mockResolvedValue(room),
    },
  });

  await join(Database, Board, Socket, input);

  expect(Database.update).toBeCalledWith({
    id: "room-id",
    players: [...room.players, input.userId],
  });

  expect(Socket.emit).toBeCalledWith({
    channel: "server:join:room",
    message: {
      id: input.roomId,
      userId: input.userId
    }
  });
});
