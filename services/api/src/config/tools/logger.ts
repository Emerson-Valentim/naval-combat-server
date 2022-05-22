import { ServerContext } from "../server";
import { CLogger } from "../../ports/logger";

const keysToMask = ["authorization", "password", "accessToken", "refreshToken", "base64"];

export default {
  async requestDidStart({ request, context }: { request: any, context: ServerContext }) {
    const startedAt = new Date().toISOString();

    CLogger.log(
      maskSensitiveData({ request, startedAt, context, level: "info" }, keysToMask)
    );
    return {
      async willSendResponse({ response, ...resto }: { response: any }) {
        const finishedAt = new Date().toISOString();

        CLogger.log(
          maskSensitiveData(
            {
              request,
              response,
              context,
              finishedAt,
              startedAt,
            },
            keysToMask
          )
        );
      },
    };
  },
};

const maskSensitiveData = (data: any, fields: string[]) => {
  const masked = fields.reduce((maskedString, field) => {
    const regex = new RegExp(`(?<=${field}\\":\\")(.*?)(?=\\")`, "g");

    return maskedString.replace(regex, "*");
  }, JSON.stringify(data));

  return JSON.parse(masked);
};
