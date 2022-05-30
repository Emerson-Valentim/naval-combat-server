import { Board } from "../ports/database";

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
    ...data,
  };
};
