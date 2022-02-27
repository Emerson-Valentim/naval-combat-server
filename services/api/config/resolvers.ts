/* eslint-disable @typescript-eslint/no-unused-vars */
import { exampleDomain } from "@naval-combat-server/domains";

import { CLogger } from "../ports/logger";

export const resolvers = {
  Query: {
    status: () => true,
  },
  Mutation: {
    example: async (_parent: any, _args: any) => {
      CLogger.info(`Reached API at ${new Date().getTime()}`);

      const result = await exampleDomain(_args.input.value);

      return {
        value: result
      };
    },
  },
};
