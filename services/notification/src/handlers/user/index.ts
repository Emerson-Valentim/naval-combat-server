import { Socket } from "socket.io";

import { IOHandler } from "../../config/tools";

interface UserSocketEvents {
  "client:signIn": () => void;
}

const register = (socket: Socket<UserSocketEvents>): void => {
  socket.on("client:signIn", async () => {
    await IOHandler.handleOrigin<{ id: string; userId: string }>(
      "client:signIn",
      Buffer.from("{}"),
      socket
    );

    return;
  });
};

export default {
  register
};
