/* eslint-disable @typescript-eslint/no-unused-vars */
import { NavalCombatSocket } from "../../ports/notification";

import example from "./example";

export const resolvers = {
  Query: {
    status: () => true,
  },
  Mutation: {
    example: async (_parent: any, _args: any) => example(NavalCombatSocket, _args.input),
  },
};
