import { CLogger } from "evs-tools";
import {
  room as RoomDomain,
  user as UserDomain,
} from "@naval-combat-server/domains";

import BaseSocketHandler from "../@types/base-socket-handler";

interface RoomSocketEvents {
  "server:create:room": (message: any) => void;
  "client:room:new": (message: any) => void;
  "client:room:ready": (message: any) => void;
  "client:room:acknowledge": (message: any) => void;
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
      CLogger.info({
        channel: "server:create:room",
        date: new Date().getTime(),
      });

      const payload = await this.handleOrigin<{ id: string; userId: string }>(
        "server",
        message
      );

      if (!payload) return;

      const { id, userId } = payload;

      try {
        await this.dependencies?.roomDomain.registerSocket({
          id,
        });

        const user = await this.dependencies?.userDomain.get(userId);

        if (user?.socketId) {
          this.io.to(user.socketId).emit(`client:room:ready`, {
            date: new Date().getTime(),
            roomId: id,
          });
        }

        this.io.emit(`client:room:new`, {
          date: new Date().getTime(),
        });
      } catch (error: any) {
        CLogger.error({
          handler: "rooms",
          error: error.message,
        });
      }
    });

    this.socket.on(`client:room:acknowledge`, async (message: any) => {
      CLogger.info({
        channel: "client:room:acknowledge",
        date: new Date().getTime(),
      });

      const payload = await this.handleOrigin<{ roomId: string }>(
        "client",
        message
      );

      if (!payload) return;

      this.socket.join(payload.roomId);
    });
  }
}
