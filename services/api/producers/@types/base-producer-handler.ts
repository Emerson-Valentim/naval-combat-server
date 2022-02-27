import KafkaHandler from "../../ports/kafka/handler";

import { KafkaProducerRecord } from "./message-payload";

export abstract class BaseProducerHandler {

  protected static kafkaHandler: KafkaHandler;

  public static init(_kafkaHandler: KafkaHandler) {
    BaseProducerHandler.kafkaHandler = _kafkaHandler;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static async send(_payload: KafkaProducerRecord): Promise<void> {
    throw new Error("Method not implemented");
  }
}