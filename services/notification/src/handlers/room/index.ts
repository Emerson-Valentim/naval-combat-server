import { CLogger } from "evs-tools";
import {
  room as RoomDomain,
  user as UserDomain,
} from "@naval-combat-server/domains";
import { Socket } from "socket.io";

import { IOHandler } from "../../config/tools";

interface RoomSocketEvents {
  "server:create:room": (message: any) => void;
  "server:join:room": (message: any) => void;
  "client:room:refresh": (message: any) => void;
  "client:room:ready": (message: any) => void;
  "client:room:acknowledge": (message: any) => void;
  "client:room:join:acknowledge": (message: any) => void;
  "client:room:disconnect": (message: any) => void;
  "client:room:join": (message: any) => void;
}

const getUser = async (
  userDomain: typeof UserDomain,
  id: string,
  field: "id" | "socket"
) => {
  const user = await userDomain.get(id, field);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const refreshRooms = () => {
  IOHandler.io.emit("client:room:refresh", {
    date: new Date().getTime(),
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

    const user = await getUser(dependencies.userDomain, userId, "id");

    if (user?.socketId) {
      IOHandler.io.to(user.socketId).emit("client:room:ready", {
        date: new Date().getTime(),
        roomId: id,
      });
    }

    try {
      await dependencies.roomDomain.registerSocket({
        id,
      });

      refreshRooms();
    } catch (error: any) {
      CLogger.error({
        handler: "rooms",
        error: error.message,
      });
    }
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

    const user = await getUser(dependencies.userDomain, payload.userId, "id");

    if (user?.socketId) {
      IOHandler.io.to(user.socketId).emit("client:room:join", {
        roomId: payload.id,
      });
    }
  });

  socket.on("client:room:join:acknowledge", async (message: any) => {
    const payload = await IOHandler.handleOrigin<{
      roomId: string;
    }>("client:room:join:acknowledge", message, socket);

    socket.join(payload.roomId);

    const user = await getUser(dependencies.userDomain, socket.id, "socket");

    IOHandler.io.in(payload.roomId).emit("client:room:connection", {
      username: user?.username,
    });
  });

  socket.on("client:room:disconnect", async (message: any) => {
    const payload = await IOHandler.handleOrigin<{
      roomId: string;
    }>("client:room:disconnect", message, socket);

    const user = await getUser(dependencies.userDomain, socket.id, "socket");

    console.log(socket.id, user.id);

    await dependencies.roomDomain.leave({
      roomId: payload.roomId,
      userId: user.id,
    });

    IOHandler.io.in(payload.roomId).emit("client:room:disconnect", {
      username: user?.username,
    });

    socket.leave(payload.roomId);

    refreshRooms();
  });
};

export default {
  register,
};
