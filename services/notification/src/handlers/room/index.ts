import {
  room as RoomDomain,
  user as UserDomain,
} from "@naval-combat-server/domains";
import { Socket } from "socket.io";

import { IOHandler } from "../../config/tools";

interface RoomSocketEvents {
  "server:create:room": (message: any) => void;
  "server:join:room": (message: any) => void;
  "server:setup:room": (message: any) => void;
  "client:room:refresh": (message: any) => void;
  "client:room:ready": (message: any) => void;
  "client:room:acknowledge": (message: any) => void;
  "client:room:join:acknowledge": (message: any) => void;
  "client:room:disconnect": (message: any) => void;
  "client:room:join": (message: any) => void;
  "client:room:update": (message: any) => void;
  "client:room:message": (message: any) => void;
}

const getUser = async (userDomain: typeof UserDomain, id: string) => {
  const user = await userDomain.get(id, "id");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const refreshRooms = () => {
  IOHandler.toAll({
    channel: "client:room:refresh",
    message: {
      date: new Date().getTime(),
    },
  });
};

const register = (
  socket: Socket<RoomSocketEvents>,
  dependencies: {
    roomDomain: typeof RoomDomain;
    userDomain: typeof UserDomain;
  }
): void => {
  socket.on("server:create:room", async (message: Buffer) => {
    const payload = await IOHandler.handleOrigin<{
      id: string;
      userId: string;
    }>("server:create:room", message, socket);

    const { id, userId } = payload;

    const user = await getUser(dependencies.userDomain, userId);

    if (user?.socketId) {
      IOHandler.toUser(user.socketId, {
        channel: "client:room:ready",
        message: {
          date: new Date().getTime(),
          roomId: id,
        },
      });
    }

    await dependencies.roomDomain.registerSocket({
      id,
    });

    refreshRooms();
  });

  socket.on("client:room:acknowledge", async (message: any) => {
    const payload = await IOHandler.handleOrigin<{
      roomId: string;
    }>("client:room:acknowledge", message, socket);

    socket.join(payload.roomId);
  });

  socket.on("server:join:room", async (message: any) => {
    const payload = await IOHandler.handleOrigin<{
      id: string;
      userId: string;
    }>("server:join:room", message, socket);

    const user = await getUser(dependencies.userDomain, payload.userId);

    refreshRooms();

    if (user?.socketId) {
      IOHandler.toUser(user.socketId, {
        channel: "client:room:join",
        message: {
          roomId: payload.id,
        },
      });
    }
  });

  socket.on("client:room:join:acknowledge", async (message: any) => {
    const payload = await IOHandler.handleOrigin<{
      roomId: string;
    }>("client:room:join:acknowledge", message, socket);

    socket.join(payload.roomId);

    const user = await getUser(dependencies.userDomain, socket.data.userId);

    IOHandler.toRoom(payload.roomId, {
      channel: "client:room:update",
      message: {
        action: "join",
        username: user.username,
      },
    });

    refreshRooms();
  });

  socket.on("client:room:disconnect", async (message: any) => {
    const payload = await IOHandler.handleOrigin<{
      roomId: string;
    }>("client:room:disconnect", message, socket);

    const user = await getUser(dependencies.userDomain, socket.data.userId);

    await dependencies.roomDomain.leave({
      roomId: payload.roomId,
      userId: user.id,
    });

    IOHandler.toRoom(payload.roomId, {
      channel: "client:room:update",
      message: {
        action: "leave",
        username: user.username,
      },
    });

    refreshRooms();
  });

  socket.on("client:room:message", async (message: any) => {
    const payload = await IOHandler.handleOrigin<{
      roomId: string;
      message: string;
    }>("client:room:message", message, socket);

    const user = await getUser(dependencies.userDomain, socket.data.userId);

    IOHandler.toRoom(payload.roomId, {
      channel: "client:room:update",
      message: {
        action: "message",
        username: user.username,
        message: payload.message,
      },
    });
  });

  socket.on("server:setup:room", async (message: any) => {
    const payload = await IOHandler.handleOrigin<{
      roomId: string;
    }>("server:setup:room", message, socket);

    IOHandler.toRoom(payload.roomId, {
      channel: "client:room:update",
      message: {
        action: "turn",
      },
    });

  });
};

export default {
  register,
};
