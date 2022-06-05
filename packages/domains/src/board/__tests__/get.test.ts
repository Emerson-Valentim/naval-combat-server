import get from "../get";

import { buildBoard, buildMock as buildBoardMock } from "./board-factory";

const buildMock = ({ database }: any = {}) => {
  return {
    Database: buildBoardMock(database),
  };
};

describe("get()", () => {
  const input = {
    id: "id",
    userId: "user-id",
  };

  const board = buildBoard();

  it("calls database and returns a board", async () => {
    const { Database } = buildMock({
      database: {
        findBy: jest.fn().mockResolvedValue(board),
      },
    });

    await get(Database, input);

    expect(Database.findBy).toBeCalledWith({ roomId: input.id });
  });

  describe("provides inexistent room", () => {
    it("throws an error", async () => {
      const { Database } = buildMock();

      await expect(get(Database, input)).rejects.toThrowError(
        "Board not found"
      );
    });
  });
});
