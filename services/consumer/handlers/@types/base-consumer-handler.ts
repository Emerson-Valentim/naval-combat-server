import { KafkaMessagePayload } from "./message-payload";

export abstract class BaseConsumerHandler<Dependencies> {
  constructor(protected dependencies: Dependencies){}

  public abstract handle(_payload: KafkaMessagePayload): Promise<void>
}