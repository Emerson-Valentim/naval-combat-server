import { Job } from "bullmq";

import { CLogger } from "../ports/logger";
import SocketHandler from "../ports/socket/handler";

import {
  BaseWorkerHandler,
} from "./@types/base-worker-handler";

type ExampleWorkerDependencies = {
  socket: SocketHandler
}

export default class ExampleWorkerHandler extends BaseWorkerHandler<string, string, ExampleWorkerDependencies> {
  protected async onJobCompleted(_job: Job<string, string, string>, result: string): Promise<void> {
    CLogger.info(`Job completed with following result ${result} - Queue: ${this.queueName}`);

    this.dependencies?.socket.emit({ channel: "server:example:job:done", message: Buffer.from(JSON.stringify({ date: new Date().getTime()}))});
  }

  protected async onJobFail(_job: Job<string, string, string>, error: Error): Promise<void> {
    CLogger.warn(`Job ${_job.id} failed with following message ${error.message}`);
  }

  protected async onJobError(error: Error): Promise<void> {
    CLogger.error(`Job on queue ${this.queueName} throw following error ${error.message}`);
  }

  protected async handleJob(_job: Job<string, string, string>): Promise<string> {
    return `${new Date().getTime()}/${_job.id} - done`;
  }
}
