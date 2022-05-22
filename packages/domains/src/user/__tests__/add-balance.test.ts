import addBalance from "../add-balance";

import {
  buildMock as buildUserMock,
  buildUser
} from "./user-factory";

const buildMock = ({ userMock }: any = {}) => ({
  Database: buildUserMock(userMock),
  Socket: {
    emit: jest.fn()
  }
});

describe("addBalance()", () => {
  it("provides a value and call database updating it", async () => {
    const user = buildUser();
    const { Database, Socket } = buildMock();

    await addBalance(Database, Socket, { user, value: 10 });

    expect(Database.update).toBeCalledWith({
      id: user.id,
      balance: user.balance + 10
    });

    expect(Socket.emit).toBeCalledWith({
      channel: "server:user:update",
      message: {
        id: user.id
      }
    });
  });
});