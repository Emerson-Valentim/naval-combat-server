import { Socket } from "socket.io";

import { IOHandler } from "../../config/tools";

interface UserSocketEvents {
  "client:signIn": () => void;
  "server:user:create": (message: any) => void;
  "server:user:update": (message: any) => void;
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

  socket.on("server:user:create", async (message: any) => {
    await IOHandler.handleOrigin<{ id: string; userId: string }>(
      "server:user:create",
      message,
      socket
    );

    IOHandler.toRoom("admin", {
      channel: "client:user:create",
      message: {
        date: new Date().getTime(),
      },
    });

    IOHandler.toRoom("maintainer", {
      channel: "client:user:create",
      message: {
        date: new Date().getTime(),
      },
    });

    return;
  });

  socket.on("server:user:update", async (message: any) => {
    await IOHandler.handleOrigin<{ id: string; userId: string }>(
      "server:user:update",
      message,
      socket
    );

    IOHandler.toRoom("admin", {
      channel: "client:user:update",
      message: {
        date: new Date().getTime(),
      },
    });

    IOHandler.toRoom("maintainer", {
      channel: "client:user:update",
      message: {
        date: new Date().getTime(),
      },
    });

    return;
  });
};

export default {
  register,
};
