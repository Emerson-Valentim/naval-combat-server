import mongoose, { Schema } from "mongoose";

export default class Database {
  private address: string;
  private connection!: typeof mongoose;

  constructor(address: string) {
    this.address = address;
  }

  public async getEntity(_model: string, _schema: any) {
    if (!this.isConnected()) {
      await this.connect();
    }

    if (this.isModelRegistered(_model)) {
      return mongoose.models[_model];
    }

    const schema = new Schema(_schema);

    return mongoose.model(_model, schema);
  }

  private async connect(): Promise<void> {
    if (this.isConnected()) return;

    await mongoose.connect(this.address, {
      user: process.env.MONGODB_USERNAME,
      passphrase: process.env.MONGODB_PASSWORD,
    });

    this.connection = mongoose;
  }

  private isConnected() {
    return this.connection?.connection?.readyState === 1;
  }

  private isModelRegistered(_model: string) {
    return !!mongoose.models[_model];
  }
}
