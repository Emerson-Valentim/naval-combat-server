/* eslint-disable @typescript-eslint/no-unused-vars */
import { exampleDomain } from "@naval-combat-server/domains";

import { CLogger } from "../ports/logger";
import SocketManager from "../ports/notification";
import SocketHandler from "../ports/notification/handler";

export const resolvers = {
  Query: {
    status: () => true,
  },
  Mutation: {
    example: async (_parent: any, _args: any) => {
      CLogger.info(`Reached API at ${new Date().getTime()}`);

      const socket = new SocketHandler(SocketManager.get("naval-combat"));

      socket.emit({
        channel: "server:example", message: _args.input
      });

      const result = await exampleDomain(_args.input.value);

      return {
        value: result
      };
    },
  },
};
