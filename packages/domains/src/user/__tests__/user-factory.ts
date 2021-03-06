import { User } from "../ports/database";

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

export const buildUser = (data?: any): User => {
  return {
    email: "email@email.com",
    meta: {
      wins: 0,
      loses: 0,
      matches: 0,
    },
    skin: {
      available: ["skin"],
      current: "skin"
    },
    password: "password",
    username: "username",
    roles: ["user"],
    balance: 100,
    ...data,
  };
};
