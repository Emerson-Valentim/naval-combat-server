import { Socket } from "socket.io";

import { IOHandler } from "../../config/tools";

interface SkinSocketEvents {
  "server:skin:add": (message: any) => void;
  "server:skin:update": (message: any) => void;
  "server:skin:remove": (message: any) => void;
}

const register = (socket: Socket<SkinSocketEvents>): void => {
  socket.on("server:skin:add", async (message: any) => {
    await IOHandler.handleOrigin<{ id: string; userId: string }>(
      "server:skin:add",
      message,
      socket
    );

    IOHandler.toAll({
      channel: "client:skin:add",
      message: {
        date: new Date().getTime()
      }
    });

    return;
  });

  socket.on("server:skin:update", async (message: any) => {
    await IOHandler.handleOrigin<{ id: string; userId: string }>(
      "server:skin:update",
      message,
      socket
    );

    IOHandler.toAll({
      channel: "client:skin:update",
      message: {
        date: new Date().getTime()
      }
    });

    return;
  });

  socket.on("server:skin:remove", async (message: any) => {
    await IOHandler.handleOrigin<{ id: string; userId: string }>(
      "server:skin:update",
      message,
      socket
    );

    IOHandler.toAll({
      channel: "client:skin:update",
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
