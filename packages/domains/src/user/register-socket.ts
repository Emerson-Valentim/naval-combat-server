import { curry } from "ramda";

import DatabasePort from "./ports/database";

type Input = {
  id: string;
  socketId: string;
}

const registerSocket = async (Database: typeof DatabasePort, input: Input) => {
  await Database.update({
    id: input.id,
    socketId: input.socketId,
  });
};

export default curry(registerSocket);
