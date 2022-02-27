import { Job, JobsOptions, Queue, Worker } from "bullmq";
import { Redis } from "ioredis";

import { CLogger } from "../../ports/logger";

export interface WorkerParameters {
  queueName: string;
}

export abstract class BaseWorkerHandler<JobPayload, JobResult, Dependencies> {
  protected connection: Redis;
  protected queueName: string;
  protected dependencies: Dependencies | undefined;

  private queue!: Queue;
  private worker!: Worker;

  constructor({ queueName }: WorkerParameters, connection: Redis) {
    this.queueName = queueName;
    this.connection = connection;
  }

  public register(dependencies?: Dependencies) {
    this.dependencies = dependencies;

    this.queue = new Queue(this.queueName, { connection: this.connection });

    this.worker = new Worker(this.queueName, this.handleJob.bind(this), {
      connection: this.connection,
    });

    this.worker.on("completed", this.onJobCompleted.bind(this));
    this.worker.on("failed", this.onJobFail.bind(this));
    this.worker.on("error", this.onJobError.bind(this));

    CLogger.log(`Queue ${this.queueName} registered successfully`);
  }

  public async add(data: JobPayload, options?: JobsOptions) {
    await this.queue.add(this.queueName, data, options);
  }

  protected abstract onJobCompleted(job: Job<JobPayload, JobResult>, result: JobResult): Promise<void>;
  protected abstract onJobFail(job: Job<JobPayload, JobResult>, error: Error): Promise<void>;
  protected abstract onJobError(error: Error): Promise<void>;
  protected abstract handleJob(job: Job<JobPayload, JobResult>): Promise<JobResult>;
}
