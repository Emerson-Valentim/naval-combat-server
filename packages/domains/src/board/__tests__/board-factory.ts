import { Board, BoardStatus } from "../ports/database";

export const buildMock = (boardFactory?: any) => {
  const mock = {
    ...jest.requireMock("../ports/database"),
  }.default;

  return {
    ...mock,
    ...jest.requireMock("../").default,
    ...boardFactory,
  };
};

export const buildBoard = (data?: any): Board => {
  return {
    id: "id",
    createdAt: 1,
    currentPlayer: "user-id",
    roomId: "room-id",
    size: 10,
    state: {
      "user-id": {
        positions: [],
        status: BoardStatus.PENDING
      },
    },
    status: BoardStatus.PENDING,
    updatedAt: 1,
    ...data,
  };
};
