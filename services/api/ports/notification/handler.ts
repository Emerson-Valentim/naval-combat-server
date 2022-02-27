import { CLogger } from "evs-tools";
import LibSocketHandler from "evs-tools/dist/app/connectors/socket/handler";

export default class SocketHandler extends LibSocketHandler {
  public async emit<T>({
    channel,
    message,
  }: {
    channel: string;
    message: T;
  }) {
    try {
      this.socket.emit(channel, this.encodeMessage<T>(message));
    } catch (error: unknown) {
      CLogger.error(
        {
          path: "/app/ports/notification/handler",
          message: (error as Error).message,
        },
        true
      );
    }
  }

  private encodeMessage<T>(value: T): Buffer {
    if (!value) throw new Error("Message is empty");

    const stringifiedValue = JSON.stringify(value);

    const hashedValue = stringifiedValue;

    return Buffer.from(hashedValue);
  }
}