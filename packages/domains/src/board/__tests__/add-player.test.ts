import addPlayer from "../add-player";
import { BoardStatus } from "../ports/database";

import { buildBoard, buildMock as buildBoardMock } from "./board-factory";

const buildMock = ({ database }: any = {}) => {
  return {
    Database: buildBoardMock(database),
  };
};

describe("addPlayer()", () => {
  beforeEach(jest.clearAllMocks);

  const board = buildBoard();

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

    await addPlayer(Database, { roomId: board.roomId, playerId: "user-id-2" });

    expect(Database.findBy).toBeCalledWith({ roomId: board.roomId });

    expect(Database.update).toBeCalledWith({
      id: board.id,
      state: {
        ...board.state,
        "user-id-2": {
          positions: ["state"],
          status: BoardStatus.PENDING,
        },
      },
    });
  });

  describe("provides inexistent room id", () => {
    it("throws an error", async () => {
      const { Database } = buildMock();

      await expect(
        addPlayer(Database, { roomId: "room", playerId: "player-id" })
      ).rejects.toThrowError("Board not found");
    });
  });
});
