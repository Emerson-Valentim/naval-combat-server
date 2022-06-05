import removePlayer from "../remove-player";
import { BoardStatus } from "../ports/database";

import { buildBoard, buildMock as buildBoardMock } from "./board-factory";

const buildMock = ({ database }: any = {}) => {
  return {
    Database: buildBoardMock(database),
  };
};

describe("removePlayer()", () => {
  beforeEach(jest.clearAllMocks);

  const board = buildBoard();

  const input = { roomId: board.roomId, playerId: "user-id-2" };

  it("calls database and setup board state", async () => {
    const { Database } = buildMock({
      database: {
        findBy: jest.fn().mockResolvedValue(board),
        buildState: jest.fn().mockReturnValue({
          positions: ["state"],
          status: BoardStatus.PENDING,
        }),
      },
    });

    await removePlayer(Database, input);

    expect(Database.findBy).toBeCalledWith({ roomId: board.roomId });

    expect(Database.update).toBeCalledWith({
      id: board.id,
      status: BoardStatus.PENDING,
      state: board.state
    });
  });

  it("calls database and finish board", async () => {
    const { Database } = buildMock({
      database: {
        findBy: jest.fn().mockResolvedValue({
          ...board,
          status: BoardStatus.DONE
        }),
        buildState: jest.fn().mockReturnValue({
          positions: ["state"],
          status: BoardStatus.PENDING,
        }),
      },
    });

    await removePlayer(Database, input);

    expect(Database.findBy).toBeCalledWith({ roomId: board.roomId });

    expect(Database.update).toBeCalledWith({
      id: board.id,
      status: BoardStatus.FINISHED,
      state: board.state
    });
  });

  describe("provides inexistent room id", () => {
    it("throws an error", async () => {
      const { Database } = buildMock();

      await expect(
        removePlayer(Database, { roomId: "room", playerId: "player-id" })
      ).rejects.toThrowError("Board not found");
    });
  });
});
