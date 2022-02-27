/* eslint-disable @typescript-eslint/no-unused-vars */
import { CLogger } from "../ports/logger";
import { ExampleProducer } from "../producers";

export const resolvers = {
  Query: {
    status: () => true,
  },
  Mutation: {
    example: async (_parent: any, _args: any) => {
      CLogger.info(`Reached API at ${new Date().getTime()}`);

      await ExampleProducer.send({
        messages: [
          {
            key: "example-key",
            value: JSON.stringify(_args.input),
          },
        ],
      });

      return _args.input;
    },
  },
};
