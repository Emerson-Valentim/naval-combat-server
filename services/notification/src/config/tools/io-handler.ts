import { Server, Socket } from "socket.io";

import { originDictionary } from "../../commands/dictionary";
import { CLogger } from "../../ports/logger";

export default abstract class IOHandler {
  private static originDictionary = originDictionary;

  public static io: Server;

  public static setup(
    io: any,

  ) {
    if(!this.io) {
      this.io = io;
    }
  }

  protected static fromBufferToString(message: Buffer) {
    if (!message) return "";

    return Buffer.from(message).toString();
  }

  public static async handleOrigin<T>(
    channel: string,
    message: Buffer,
    socket: Socket
  ): Promise<T> {
    CLogger.info({
      channel,
      id: socket.id,
      date: new Date().getTime(),
    });

    const stringifiedMessage = this.fromBufferToString(message);

    const originCommand = this.originDictionary[channel.split(":")[0]];

    const originResponse = await originCommand.execute(
      stringifiedMessage,
      socket
    );

    if (!originResponse) {
      throw new Error("Empty message");
    }

    return originResponse;
  }

}
