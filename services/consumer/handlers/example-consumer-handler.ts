import { WorkerHandler } from "evs-tools/dist/app/connectors/worker/handler";

import { CLogger } from "../ports/logger";
import SocketHandler from "../ports/socket/handler";

import { BaseConsumerHandler } from "./@types/base-consumer-handler";
import { KafkaMessagePayload } from "./@types/message-payload";

interface ExampleConsumerDependencies {
  socket: SocketHandler;
  worker: WorkerHandler<any>;
}
export default class ExampleConsumerHandler extends BaseConsumerHandler<ExampleConsumerDependencies> {
  public async handle(_payload: KafkaMessagePayload): Promise<void> {
    CLogger.info(`Reached Event Broker at ${new Date().getTime()}`);

    const {
      message: { value },
    } = _payload;

    await this.dependencies.worker.add("Worker event");

    this.dependencies.socket.emit({
      channel: "server:example",
      message: value,
    });
  }
}
