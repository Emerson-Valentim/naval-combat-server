/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testRegex: "test.[jt]s$",
  testPathIgnorePatterns: ["node_modules", "build"],
};