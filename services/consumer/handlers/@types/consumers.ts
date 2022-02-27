import { BaseConsumerHandler } from "./base-consumer-handler";
import { Topics } from "./topics";

export type Consumers = {
  [key in Topics]: {
    eventHandler: typeof BaseConsumerHandler.prototype;
    groupId: string;
  };
}