import { ServerContext } from "../server";
import { CLogger } from "../../ports/logger";

const keysToMask = [
  "authorization",
  "password",
  "accessToken",
  "refreshToken",
  "base64",
];

export default {
  async requestDidStart({
    request,
    context,
  }: {
    request: any;
    context: ServerContext;
  }) {
    const startedAt = new Date().toISOString();

    CLogger.maskedLog(
      { request, startedAt, context, level: "info" },
      keysToMask
    );
    return {
      async willSendResponse({ response }: { response: any }) {
        const finishedAt = new Date().toISOString();

        CLogger.maskedLog(
          {
            request,
            response,
            context,
            finishedAt,
            startedAt,
          },
          keysToMask
        );
      },
    };
  },
};
