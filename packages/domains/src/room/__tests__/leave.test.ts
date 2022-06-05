import { buildBoard, buildMock as buildBoardMock } from "../../board/__tests__/board-factory";
import { buildMock as buildUserMock } from "../../user/__tests__/user-factory";
import leave from "../leave";
import { RoomStatus } from "../ports/database";

import { buildMock as buildRoomMock, buildRoom } from "./room-factory";

const buildMock = ({ database, boardMock }: any = {}) => {
  return {
    Database: buildRoomMock(database),
    Board: buildBoardMock(boardMock),
    User: buildUserMock(),
  };
};

beforeEach(jest.clearAllMocks);

test("should throw an error because room does not exist", async () => {
  const { Database, Board, User } = buildMock();

  await expect(
    leave(Database, Board, User, {
      roomId: "room-id",
      userId: "user-id",
    })
  ).rejects.toThrowError("Room not found");

  expect(Database.findById).toBeCalledWith("room-id");
});

test("should not update room if user id is not a player", async () => {
  const { Database, Board, User } = buildMock({
    database: {
      findById: jest.fn().mockResolvedValue(buildRoom()),
    },
  });

  await leave(Database, Board, User, {
    roomId: "room-id",
    userId: "user-id2",
  });

  expect(Database.findById).toBeCalledWith("room-id");

  expect(Database.update).not.toBeCalled();
});

test("should DELETE room because players list is empty", async () => {
  const room = buildRoom({
    limit: 1,
  });

  const input = {
    roomId: "room-id",
    userId: "user-id",
  };

  const { Database, Board, User } = buildMock({
    database: {
      findById: jest.fn().mockResolvedValue(room),
    },
    boardMock: {
      removePlayer: jest.fn().mockResolvedValue(buildBoard())
    }
  });

  await leave(Database, Board, User, input);

  expect(Database.update).toBeCalledWith({
    id: input.roomId,
    players: [],
    status: RoomStatus.DELETED,
    owner: undefined
  });
});

test("should UPDATE room's owner because it left", async () => {
  const room = buildRoom({
    limit: 2,
    players: ["user-id", "user-id2"]
  });

  const input = {
    roomId: "room-id",
    userId: "user-id",
  };

  const { Database, Board, User } = buildMock({
    database: {
      findById: jest.fn().mockResolvedValue(room),
    },
    boardMock: {
      removePlayer: jest.fn().mockResolvedValue(buildBoard())
    }
  });

  await leave(Database, Board, User, input);

  expect(Database.update).toBeCalledWith({
    id: input.roomId,
    players: ["user-id2"],
    status: room.status,
    owner: room.players[1]
  });
});