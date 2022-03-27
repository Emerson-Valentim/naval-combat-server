import registerSocket from "../register-socket";
import { RoomStatus } from "../ports/database";

import { buildMock as buildRoomMock } from "./room-factory";

const buildMock = ({ database }: any = {}) => {
  return {
    Database: buildRoomMock(database),
  };
};

test("should update room status to CREATED", async() => {
  const input = {
    id: "id"
  };

  const { Database } = buildMock();

  await registerSocket(Database, input);

  expect(Database.update).toBeCalledWith({
    id: input.id,
    status: RoomStatus.CREATED,
  });
});