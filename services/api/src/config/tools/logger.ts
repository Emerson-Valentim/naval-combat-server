import crypto from "crypto";

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
    const requestId = crypto.randomUUID();

    CLogger.maskedLog({ request, startedAt, context, requestId }, keysToMask);
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
            requestId,
          },
          keysToMask
        );
      },
    };
  },
};
