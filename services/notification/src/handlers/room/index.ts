import { CLogger } from "evs-tools";
import { room as RoomDomain } from "@naval-combat-server/domains";

import BaseSocketHandler from "../@types/base-socket-handler";

interface RoomSocketEvents {
  "server:create:room": (message: any) => void;
  [roomId: string]: (message: any) => void;
}

export default class RoomHandler extends BaseSocketHandler<
RoomSocketEvents,
{
  roomDomain: typeof RoomDomain;
}
> {
  protected register(): void {
    this.socket.on("server:create:room", async (message: Buffer) => {
      const payload = await this.handleOrigin<{ id: string }>(
        "server",
        message
      );

      if (!payload) return;

      const { id } = payload;

      try {
        await this.dependencies?.roomDomain.registerSocket({
          id,
        });

        this.socket.emit(`client:room:ready:${id}`, null);
      } catch (error: any) {
        CLogger.error({
          handler: "rooms",
          error: error.message,
        });
      }
    });
  }
}
