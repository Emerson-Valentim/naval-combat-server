import { curry } from "ramda";

import DatabasePort, { RoomStatus } from "./ports/database";

type Input = {
  id: string;
}

const registerSocket = async (Database: typeof DatabasePort, input: Input) => {
  await Database.update({
    id: input.id,
    status: RoomStatus.CREATED,
  });
};

export default curry(registerSocket);
