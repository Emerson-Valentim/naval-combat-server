import { CLogger } from "evs-tools";
import LibSocketHandler from "evs-tools/dist/app/connectors/socket/handler";
import { encryption } from "@naval-combat-server/domains";

export default class SocketHandler extends LibSocketHandler {
  public async emit<T>({
    channel,
    message,
  }: {
    channel: string;
    message: T;
  }) {
    try {
      await this.socket.emit(channel, await this.encodeMessage<T>(message));
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

  private async encodeMessage<T>(value: T): Promise<Buffer> {
    if (!value) throw new Error("Message is empty");

    const stringifiedValue = JSON.stringify(value);

    const hashedValue = await encryption.encrypt(stringifiedValue);

    return Buffer.from(hashedValue);
  }
}