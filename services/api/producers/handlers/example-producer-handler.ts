import { BaseProducerHandler } from "../@types/base-producer-handler";
import { KafkaProducerRecord } from "../@types/message-payload";

export default class ExampleProducerHandler extends BaseProducerHandler {
  public static async send(record: KafkaProducerRecord): Promise<void> {

    const producer = await ExampleProducerHandler.kafkaHandler.getProducer();

    await producer.send({
      ...record,
      topic: "example-app"
    });

    await producer.disconnect();

    return;
  }
}
