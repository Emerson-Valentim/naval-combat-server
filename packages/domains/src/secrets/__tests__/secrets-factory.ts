export const buildMock = (secretManager?: any) => {
  return {
    ...jest.requireMock("../").default,
    ...secretManager
  };
};