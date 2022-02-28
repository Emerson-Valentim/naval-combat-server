export const buildMock = (secretManager?: any) => {
  return {
      ...jest.requireMock("../../secrets"),
      ...secretManager
  };
};