import { Socket } from "socket.io";

import { IOHandler } from "../../config/tools";

interface FundsSocketEvents {
  "server:funds:approve": (message: any) => void;
  "server:funds:request": (message: any) => void;
}

const register = (socket: Socket<FundsSocketEvents>): void => {
  socket.on("server:funds:approve", async (message: any) => {
    await IOHandler.handleOrigin<{ id: string; userId: string }>(
      "server:funds:approve",
      message,
      socket
    );

    IOHandler.toRoom("admin", {
      channel: "client:funds:approve",
      message: {
        date: new Date().getTime()
      }
    });

    IOHandler.toRoom("maintainer", {
      channel: "client:funds:approve",
      message: {
        date: new Date().getTime()
      }
    });

    return;
  });

  socket.on("server:funds:request", async (message: any) => {
    await IOHandler.handleOrigin<{ id: string; userId: string }>(
      "server:funds:request",
      message,
      socket
    );

    IOHandler.toRoom("admin", {
      channel: "client:funds:request",
      message: {
        date: new Date().getTime()
      }
    });

    IOHandler.toRoom("maintainer", {
      channel: "client:funds:request",
      message: {
        date: new Date().getTime()
      }
    });

    return;
  });
};

export default {
  register
};
