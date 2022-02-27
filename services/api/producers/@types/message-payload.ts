import { ProducerRecord } from "kafkajs";

export type KafkaProducerRecord = Omit<ProducerRecord, "topic">