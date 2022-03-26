import { Server, Socket } from "socket.io";

import { originDictionary } from "../../commands/dictionary";
import { CLogger } from "../../ports/logger";

export default abstract class IOHandler {
  private static io: Server;
  private static originDictionary = originDictionary;

  public static setup(io: any) {
    if (!this.io) {
      IOHandler.io = io;
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

  public static toAll({ channel, message }: { channel: string; message: any }) {
    IOHandler.io.emit(channel, message);
  }

  public static toRoom(
    roomId: string,
    { channel, message }: { channel: string; message: any }
  ) {
    IOHandler.io.in(roomId).emit(channel, message);
  }

  public static toUser(
    socketId: string,
    { channel, message }: { channel: string; message: any }
  ) {
    IOHandler.io.to(socketId).emit(channel, message);
  }
}
