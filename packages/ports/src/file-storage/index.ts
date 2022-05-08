import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const LOCAL_ADDRESS = "host.docker.internal";

export default class FileStorage {
  private client: S3Client;
  private isLocal: boolean;

  constructor(private bucket: "skins") {
    this.isLocal = process.env.APP_ENV === "local";

    this.client = new S3Client({
      forcePathStyle: this.isLocal,
      region: "sa-east-1",
      endpoint: this.isLocal ? `http://${LOCAL_ADDRESS}:4566` : "",
      credentials: this.isLocal
        ? {
          accessKeyId: "xxx",
          secretAccessKey: "xxx",
        }
        : undefined,
    });
  }

  public async get({
    filename,
    contentType,
  }: {
    filename: string;
    contentType: string;
  }): Promise<string> {
    const command = new GetObjectCommand({
      Key: filename,
      Bucket: this.bucket,
      ResponseContentType: contentType,
    });

    const url = await getSignedUrl(this.client, command);

    return this.isLocal ? url.replace(LOCAL_ADDRESS, "localhost") : url;
  }

  public async add({
    filename,
    base64,
    contentType,
  }: {
    filename: string;
    base64: string;
    contentType: string;
  }): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: filename,
      Body: Buffer.from(base64, "base64"),
      ContentEncoding: "base64",
      ContentType: contentType,
    });

    await this.client.send(command);

    return filename;
  }
}
