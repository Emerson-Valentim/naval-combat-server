import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const LOCAL_ADDRESS = "host.docker.internal";

export default class FileStorage {
  private client: S3Client;
  private isLocal: boolean;

  constructor(private bucket: string) {
    this.isLocal = process.env.APP_ENV === "local";

    this.client = new S3Client({
      forcePathStyle: this.isLocal,
      region: "sa-east-1",
      endpoint: this.isLocal ? `http://${LOCAL_ADDRESS}:4566` : undefined,
      credentials: this.isLocal
        ? {
          accessKeyId: "xxx",
          secretAccessKey: "xxx",
        }
        : undefined,
    });
  }

  public async get({
    location,
    contentType,
  }: {
    location: string;
    contentType: string;
  }): Promise<string> {
    const command = new GetObjectCommand({
      Key: location,
      Bucket: this.bucket,
      ResponseContentType: contentType,
    });

    const url = await getSignedUrl(this.client, command);

    return this.isLocal ? url.replace(LOCAL_ADDRESS, "localhost") : url;
  }

  public async add({
    location,
    base64,
    contentType,
  }: {
    location: string;
    base64: string;
    contentType: string;
  }): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: location,
      Body: Buffer.from(base64, "base64"),
      ContentEncoding: "base64",
      ContentType: contentType,
    });

    await this.client.send(command);

    return location;
  }

  public async remove({ location }: { location: string }): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: location,
    });

    await this.client.send(command);

    return;
  }
}
