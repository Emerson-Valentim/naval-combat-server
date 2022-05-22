import approve from "../approve";

import {
  buildMock as buildUserMock,
  buildUser,
} from "../../user/__tests__/user-factory";

import { FundsStatus } from "../ports/database";

import { buildFund, buildMock as buildFundsMock } from "./funds-factory";

const buildMock = ({ fundsMock, userMock }: any = {}) => {
  return {
    Database: buildFundsMock(fundsMock),
    User: buildUserMock(userMock),
    Socket: {
      emit: jest.fn(),
    },
  };
};

describe("approve()", () => {
  const user = buildUser();
  const agent = buildUser({
    id: "agent-id",
  });
  const fund = buildFund({
    userId: user.id,
  });

  const input = {
    agentId: agent.id,
    id: fund.id,
  };

  it("calls database, update funds status and add user balance", async () => {
    const { Database, User, Socket } = buildMock({
      fundsMock: {
        findById: jest.fn().mockResolvedValue(fund),
      },
      userMock: {
        get: jest
          .fn()
          .mockImplementation((id) =>
            [user, agent].find(({ id: filteredId }) => filteredId === id)
          ),
      },
    });

    await approve(Database, User, Socket, input);

    expect(Database.update).toBeCalledWith({
      ...input,
      status: FundsStatus.CREDITED,
      updatedAt: expect.any(Number),
    });

    expect(User.addBalance).toBeCalledWith(Socket, {
      user,
      value: fund.value,
    });

    expect(Socket.emit).toBeCalledWith({
      channel: "server:funds:approve",
      message: {
        id: fund.id,
        userId: fund.userId,
      },
    });
  });

  describe("provides inexistent funds", () => {
    it("throws an error", async () => {
      const { Database, User, Socket } = buildMock();

      await expect(approve(Database, User, Socket, input)).rejects.toThrowError(
        "Fund not found"
      );
    });
  });

  describe("provides credited funds", () => {
    it("throws an error", async () => {
      const { Database, User, Socket } = buildMock({
        fundsMock: {
          findById: jest.fn().mockResolvedValue({
            ...fund,
            status: FundsStatus.CREDITED,
          }),
        },
      });

      await expect(approve(Database, User, Socket, input)).rejects.toThrowError(
        "Only PENDING funds can be approved"
      );
    });
  });
});
