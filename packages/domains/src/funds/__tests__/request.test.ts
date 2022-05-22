import request from "../request";

import {
  buildMock as buildUserMock,
  buildUser,
} from "../../user/__tests__/user-factory";

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

describe("request()", () => {
  const user = buildUser();
  const fund = buildFund();
  const input = {
    userId: user.id,
    value: 100,
  };

  it("calls database and create fund", async () => {
    const { Database, User, Socket } = buildMock({
      userMock: {
        get: jest.fn().mockResolvedValue(user),
      },
      fundsMock: {
        create: jest.fn().mockResolvedValue(fund),
      },
    });

    await request(Database, User, Socket, input);

    expect(Database.create).toBeCalledWith({
      createdAt: expect.any(Number),
      updatedAt: expect.any(Number),
      userId: user.id,
      value: input.value,
    });

    expect(Socket.emit).toBeCalledWith({
      channel: "server:funds:request",
      message: {
        id: fund.id,
      },
    });
  });

  describe("provides invalid value", () => {
    it("throws an error", async () => {
      const { Database, User, Socket } = buildMock();

      await expect(request(Database, User, Socket, {
        ...input,
        value: 0
      })).rejects.toThrowError(
        "Funds can only be positive number"
      );
    });
  });
});
