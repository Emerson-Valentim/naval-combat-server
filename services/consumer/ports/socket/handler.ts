import { CLogger } from "evs-tools";
import LibSocketHandler from "evs-tools/dist/app/connectors/socket/handler";
export default class SocketHandler extends LibSocketHandler {
  public async emit<T>({
    channel,
    message,
  }: {
    channel: string;
    message: Buffer | null;
  }) {
    try {
      this.socket.emit(channel, this.decodeMessage<T>(message));
    } catch (error: unknown) {
      CLogger.error(
        {
          path: "/app/ports/socket/handler",
          message: (error as Error).message,
        },
        true
      );
    }
  }

  private decodeMessage<T>(value: Buffer | null): T {
    if (!value) throw new Error("Message is empty");

    return JSON.parse(Buffer.from(value).toString());
  }
}
