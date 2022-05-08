import { Skin } from "../ports/skin";

export const buildMock = (skinFactory?: any) => {
  const mock = {
    ...jest.requireMock("../ports/skin"),
  }.default;

  return {
    ...mock,
    ...jest.requireMock("../").default,
    ...skinFactory,
  };
};

export const buildSkinUsageMock = (skinUsage?: any) => {
  return {
    ...jest.requireMock("../ports/usage").default,
    ...skinUsage,
  };
};

export const buildSkinStorageMock = (skinStorageMock?: any) => {
  return {
    add: jest.fn(),
    get: jest.fn(),
    ...skinStorageMock,
  };
};

export const buildSkin = (data?: any): Skin => {
  return {
    id: "id",
    name: "name" ,
    images: {
      scenario: {
        name: "name.png",
        location: "location"
      },
      avatar: {
        name: "name.png",
        location: "location"
      }
    },
    ...data,
  };
};
