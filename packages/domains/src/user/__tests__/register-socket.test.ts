import registerSocket from "../register-socket";

import { buildMock as buildUserMock } from "./user-factory";

const buildMock = ({ userMock }: any = {}) => {
  return {
    Database: buildUserMock(userMock),
  };
};

const buildInput = (data?: any) => ({
  id: "id",
  socketId: "socket-id",
  ...data
});

test("should call update user with new socket data", async() => {
  const input = buildInput();

  const { Database } = buildMock();

  await registerSocket(Database, input);

  expect(Database.update).toBeCalledWith(input);
});