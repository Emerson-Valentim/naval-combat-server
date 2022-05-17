import { Socket } from "socket.io";
import { user as UserDomain } from "@naval-combat-server/domains";

import { IOHandler } from "../../config/tools";
interface FundsSocketEvents {
  "server:funds:approve": (message: any) => void;
  "server:funds:request": (message: any) => void;
}

const getUser = async (userDomain: typeof UserDomain, id: string) => {
  const user = await userDomain.get(id, "id");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const register = (
  socket: Socket<FundsSocketEvents>,
  dependencies: {
    userDomain: typeof UserDomain;
  }
): void => {
  socket.on("server:funds:approve", async (message: any) => {
    const payload = await IOHandler.handleOrigin<{
      id: string;
      userId: string;
    }>("server:funds:approve", message, socket);

    const { socketId } = await getUser(dependencies.userDomain, payload.userId);

    if(socketId) {
      IOHandler.toUser(socketId, {
        channel: "client:funds:approve",
        message: {
          date: new Date().getTime(),
        },
      });
    }

    IOHandler.toRoom("maintainer", {
      channel: "client:funds:approve",
      message: {
        date: new Date().getTime(),
      },
    });

    IOHandler.toRoom("admin", {
      channel: "client:funds:approve",
      message: {
        date: new Date().getTime(),
      },
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
        date: new Date().getTime(),
      },
    });

    IOHandler.toRoom("maintainer", {
      channel: "client:funds:request",
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
