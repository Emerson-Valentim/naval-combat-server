import create from "../create";

import { buildMock as buildBoardMock } from "./board-factory";

const buildMock = ({ database }: any = {}) => {
  return {
    Database: buildBoardMock(database),
  };
};

describe("create()", () => {
  const input = {
    roomId: "room-id",
    size: 10,
    currentPlayer: "player-id"
  };

  it("calls database and add new board", async () => {
    const { Database } = buildMock();

    await create(Database, input);

    expect(Database.create).toBeCalledWith(input);
  });

  describe("provides invalid size", () => {
    it("throws an error", async () => {
      const { Database } = buildMock();

      await expect(create(Database, {
        ...input,
        size: 0
      })).rejects.toThrowError("Size cant be lower or equal zero");

    });
  });
});