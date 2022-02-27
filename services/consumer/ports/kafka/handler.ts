import { Consumer } from "kafkajs";

import LibKafkaHandler from "evs-tools/dist/app/connectors/kafka/handler";

export default class KafkaHandler extends LibKafkaHandler {
  public async getConsumer(
    groupId: string
  ): Promise<Omit<Consumer, "connect">> {
    const consumer = await this.kafka.consumer({ groupId });
    await consumer.connect();
    return consumer;
  }
}
