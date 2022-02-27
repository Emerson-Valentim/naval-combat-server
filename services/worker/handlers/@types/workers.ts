import { BaseWorkerHandler } from "./base-worker-handler";
import { Queues } from "./queues";

export type Workers = {
  [key in Queues]: {
    workerHandler: Omit<typeof BaseWorkerHandler, "prototype">;
    dependencies?: any
  };
}