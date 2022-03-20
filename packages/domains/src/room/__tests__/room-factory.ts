import { Room, RoomStatus, RoomType } from "../ports/database";

export const buildMock = (userFactory?: any) => {
  const mock = {
    ...jest.requireMock("../ports/database"),
  }.default;

  return {
    ...mock,
    ...jest.requireMock("../").default,
    ...userFactory,
  };
};

export const buildRoom = (data?: any): Room => {
  return {
    id: "id",
    limit: 1,
    owner: "user-id",
    players: ["user--id"],
    status: RoomStatus.CREATED,
    title: "Title",
    type: RoomType.PUBLIC,
    ...data,
  };
};
