import { Funds, FundsStatus } from "../ports/database";

export const buildMock = (fundsFactory?: any) => {
  const mock = {
    ...jest.requireMock("../ports/database"),
  }.default;

  return {
    ...mock,
    ...jest.requireMock("../").default,
    ...fundsFactory,
  };
};

export const buildFund = (data?: any): Funds => {
  return {
    id: "id",
    userId: "user-id",
    agentId: "agent-id",
    value: 1000,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    status: FundsStatus.PENDING,
    ...data,
  };
};
