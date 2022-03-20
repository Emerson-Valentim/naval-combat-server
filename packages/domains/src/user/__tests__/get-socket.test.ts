import get from "../get";

import { buildMock as buildUserMock, buildUser } from "./user-factory";

const buildMock = ({ userMock }: any = {}) => {
  return {
    Database: buildUserMock(userMock),
  };
};

test("should call database to find an user", async() => {

  const { Database } = buildMock({
    userMock: {
      findById: jest.fn().mockResolvedValue(buildUser())
    }
  });

  await get(Database, "user-id");

  expect(Database.findById).toHaveBeenCalledWith("user-id");
});

test("should throw an error because user is not found", async() => {

  const { Database } = buildMock();

  await expect(get(Database, "user-id")).rejects.toThrowError("User not found");
});

test("should return an user without password", async() => {

  const { Database } = buildMock({
    userMock: {
      findById: jest.fn().mockResolvedValue(buildUser({
        password: "123"
      }))
    }
  });

  const response = await get(Database, "user-id");

  expect(response.email).toBeDefined();
  // @ts-expect-error we should verify if this field is undefined
  expect(response.password).toBeUndefined();
});