import { CLogger } from "evs-tools";
import { room as RoomDomain } from "@naval-combat-server/domains";

import BaseSocketHandler from "../@types/base-socket-handler";

interface RoomSocketEvents {
  "server:create:room": (message: any) => void;
  [clientRoomReadyId: string]: (message: any) => void;
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

        this.socket.emit(`client:room:ready:${id}`, {
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
      const payload = await this.handleOrigin<{ roomId: string }>(
        "client",
        message,
        this.socket
      );

      if (!payload) return;

      this.socket.join(payload.roomId);
    });
  }
}
