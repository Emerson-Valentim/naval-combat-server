export const buildMock = (encryptionFactory?: any) => {
  return {
    ...jest.requireMock("../").default,
    ...encryptionFactory
  };
};