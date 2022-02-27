import { CLogger } from "./ports/logger";
import Socket from "./ports/socket";
import Worker from "./ports/worker";
import ExampleConsumerHandler from "./handlers/example-consumer-handler";
import SocketHandler from "./ports/socket/handler";
import { Consumers } from "./handlers/@types/consumers";
import { Topics } from "./handlers/@types/topics";
import KafkaHandler from "./ports/kafka/handler";
import { KafkaManager } from "./ports/kafka";

const socketHandler = new SocketHandler(Socket.get("socket-1"));

const topics = {
  "example-app": {
    eventHandler: new ExampleConsumerHandler({
      socket: socketHandler,
      worker: Worker.get("example"),
    }),
    groupId: "example-app",
  },
};

async function start(kafkaHandler: KafkaHandler, consumers: Consumers) {
  CLogger.info("Initialization started");

  const availableTopics = Object.entries(consumers);

  const bootInitialization = availableTopics.reduce((initialState, [topic]) => {
    initialState[topic] = {
      status: "pending",
    };
    return initialState;
  }, {} as any);

  const initializationPromises = availableTopics.map(
    async ([topic, { eventHandler, groupId }]) => {
      const consumer = await kafkaHandler.getConsumer(groupId);

      await consumer.subscribe({ topic, fromBeginning: true });

      await consumer.run({
        eachMessage: eventHandler.handle.bind(eventHandler),
      });
    }
  );

  const bootResult = await Promise.allSettled(initializationPromises);

  return bootResult.reduce(
    (
      bootMessage: {
        [key in Topics]: {
          status: "rejected" | "fulfilled" | "pending";
          reason?: string | undefined;
          value?: string | unknown;
        };
      },
      result: PromiseSettledResult<unknown>,
      index
    ) => {
      const topic = availableTopics[index][0] as Topics;

      if (result.status !== "fulfilled")
        CLogger.error({ ...result, topic }, true);

      bootMessage[topic] = result;

      return bootMessage;
    },
    bootInitialization
  );
}

start(new KafkaHandler(KafkaManager.get("example-app")), topics).then(
  (message) => CLogger.info(message)
);
