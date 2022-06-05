import { CLogger as _CLogger } from "evs-tools";

class APILogger extends _CLogger {
  public static maskedLog(message: unknown, keysToMask: string[]) {
    const newMessage = APILogger.maskSensitiveData(message, keysToMask);

    //CLogger.log(JSON.stringify(newMessage, null, 2), true);
  }

  private static maskSensitiveData(data: any, fields: string[]) {
    const masked = fields.reduce((maskedString, field) => {
      const regex = new RegExp(`(?<=${field}\\":\\")(.*?)(?=\\")`, "g");

      return maskedString.replace(regex, "*");
    }, JSON.stringify(data));

    return JSON.parse(masked);
  }
}

export const CLogger = APILogger;
