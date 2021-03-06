import { buildMock as buildBoardMock } from "../../board/__tests__/board-factory";
import create from "../create";
import { RoomStatus, RoomType } from "../ports/database";

import { buildMock as buildRoomMock, buildRoom } from "./room-factory";

const buildMock = ({ database, socket }: any = {}) => {
  return {
    Database: buildRoomMock(database),
    Socket: {
      emit: socket?.emit || jest.fn(),
    },
    Board: buildBoardMock(),
  };
};

const buildInput = (data?: any) => ({
  title: "tile",
  type: RoomType.PUBLIC,
  limit: 4,
  userId: "user-id",
  ...data,
});

test("should update existing rooms status to DELETED", async () => {
  const input = buildInput();

  const rooms = [buildRoom(), buildRoom(), buildRoom()];

  const { Database, Board, Socket } = buildMock({
    database: {
      findBy: jest.fn().mockResolvedValue(rooms),
      create: jest.fn().mockResolvedValue(rooms[0])
    },
  });

  await create(Database, Board, Socket, input);

  expect(Database.findBy).toBeCalledWith({
    owner: input.userId,
    status: {
      $ne: RoomStatus.DELETED,
    },
  });

  expect(Database.update).toBeCalledTimes(3);

  expect(Database.update).toHaveBeenNthCalledWith(1, {
    id: rooms[0].id,
    status: RoomStatus.DELETED,
  });
});

test("should create a new room", async () => {
  const { userId: _, ...input } = buildInput();

  const { Database, Board, Socket } = buildMock({
    database: {
      findBy: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue(buildRoom())
    },
  });

  await create(Database, Board, Socket, input);

  expect(Database.create).toBeCalledWith({
    owner: input.userId,
    players: [input.userId],
    ...input,
  });
});

test("should call socket emit after create room", async () => {
  const input = buildInput();

  const room = buildRoom({
    ...input,
  });

  const { Database, Board, Socket } = buildMock({
    database: {
      findBy: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue(room),
    },
  });

  await create(Database, Board, Socket, input);

  expect(Socket.emit).toBeCalledWith({
    channel: "server:create:room",
    message: {
      id: room.id,
      userId: input.userId,
    },
  });
});
