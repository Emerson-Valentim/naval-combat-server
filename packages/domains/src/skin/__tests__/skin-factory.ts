import { Skin, SkinStatus } from "../ports/skin";

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
    remove: jest.fn(),
    ...skinStorageMock,
  };
};

export const buildSkin = (data?: any): Skin => {
  return {
    id: "id",
    name: "name",
    cost: 10,
    status: SkinStatus.ACTIVE,
    images: {
      scenario: {
        name: "name.png",
        location: "location-scenario"
      },
      avatar: {
        name: "name.png",
        location: "location-avatar"
      }
    },
    sounds: {
      voice: {
        name: "voice.mp3",
        location: "location-voice"
      }
    },
    ...data,
  };
};
