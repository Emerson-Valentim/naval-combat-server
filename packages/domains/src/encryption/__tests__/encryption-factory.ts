export const buildMock = (encryptionFactory?: any) => {
  return {
    ...jest.requireMock("../"),
    ...encryptionFactory
  };
};