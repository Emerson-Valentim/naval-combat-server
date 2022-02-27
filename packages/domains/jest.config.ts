import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  testRegex: "test.[jt]s$",
  testPathIgnorePatterns: ["node_modules", "build"],
};

export default config;
