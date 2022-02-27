import { KafkaManager } from "../ports/kafka";
import KafkaHandler from "../ports/kafka/handler";

import _ExampleProducer from "./handlers/example-producer-handler";

const kafkaInstance = KafkaManager.get("example-app");

_ExampleProducer.init(new KafkaHandler(kafkaInstance));

export const ExampleProducer = _ExampleProducer;