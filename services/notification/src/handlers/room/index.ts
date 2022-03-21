import { CLogger } from "evs-tools";
import {
  room as RoomDomain,
  user as UserDomain,
} from "@naval-combat-server/domains";

import BaseSocketHandler from "../@types/base-socket-handler";

interface RoomSocketEvents {
  "server:create:room": (message: any) => void;
  "server:join:room": (message: any) => void;
  "client:room:new": (message: any) => void;
  "client:room:ready": (message: any) => void;
  "client:room:acknowledge": (message: any) => void;
  "client:room:join:acknowledge": (message: any) => void;
  "client:room:disconnect": (message: any) => void;
  "client:room:join": (message: any) => void;
}

export default class RoomHandler extends BaseSocketHandler<
RoomSocketEvents,
{
  roomDomain: typeof RoomDomain;
  userDomain: typeof UserDomain;
}
> {
  protected register(): void {
    this.socket.on("server:create:room", async (message: Buffer) => {
      const payload = await this.handleOrigin<{ id: string; userId: string }>(
        "server:create:room",
        message
      );

      const { id, userId } = payload;

      const user = await this.getUser(userId);

      if (user?.socketId) {
        this.io.to(user.socketId).emit("client:room:ready", {
          date: new Date().getTime(),
          roomId: id,
        });
      }

      try {
        await this.dependencies?.roomDomain.registerSocket({
          id,
        });

        this.io.emit("client:room:new", {
          date: new Date().getTime(),
        });
      } catch (error: any) {
        CLogger.error({
          handler: "rooms",
          error: error.message,
        });
      }
    });

    this.socket.on("client:room:acknowledge", async (message: any) => {
      const payload = await this.handleOrigin<{
        roomId: string;
      }>("client:room:acknowledge", message);

      this.socket.join(payload.roomId);
    });

    this.socket.on("server:join:room", async (message: any) => {
      const payload = await this.handleOrigin<{
        id: string;
        userId: string;
      }>("server:join:room", message);

      const user = await this.getUser(payload.userId);

      if (user?.socketId) {
        this.io.to(user.socketId).emit("client:room:join", {
          roomId: payload.id,
        });
      }
    });

    this.socket.on("client:room:join:acknowledge", async (message: any) => {
      const payload = await this.handleOrigin<{
        roomId: string;
      }>("client:room:join:acknowledge", message);

      this.socket.join(payload.roomId);

      const user = await this.getUser(this.socket.data.userId);

      this.io.in(payload.roomId).emit("client:room:connection", {
        username: user?.username,
      });
    });

    this.socket.on("client:room:disconnect", async (message: any) => {
      const payload = await this.handleOrigin<{
        roomId: string;
      }>("client:room:disconnect", message);

      const user = await this.getUser(this.socket.data.userId);

      await this.dependencies?.roomDomain.leave({
        roomId: payload.roomId,
        userId: user.id,
      });

      this.io.in(payload.roomId).emit("client:room:disconnect", {
        username: user?.username,
      });

      this.socket.leave(payload.roomId);
    });
  }

  private async getUser(userId: string) {
    const user = await this.dependencies?.userDomain.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
