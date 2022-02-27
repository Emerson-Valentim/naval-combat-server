import { Managers } from "evs-tools";

Managers.KafkaManager.add([
  {
    instance: "example-app",
    clientId: "example-app",
    brokers: process.env.KAFKA_HOST?.split(",") ?? [],
  },
]);

export const KafkaManager = Managers.KafkaManager;