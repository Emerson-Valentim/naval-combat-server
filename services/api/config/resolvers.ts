/* eslint-disable @typescript-eslint/no-unused-vars */
import { CLogger } from "../ports/logger";

export const resolvers = {
  Query: {
    status: () => true,
  },
  Mutation: {
    example: async (_parent: any, _args: any) => {
      CLogger.info(`Reached API at ${new Date().getTime()}`);

      return _args.input;
    },
  },
};
