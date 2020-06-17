import Payload from "./payload";
import { logger } from "./logger";
import nodeFetch from "node-fetch";

const log = logger.get("poll-server:passToLocal", __filename);
const localHookUrl = process.env.LOCAL_HOOK_URL!;

export default async function passToLocal({
  payload,
}: {
  payload: Payload;
}): Promise<void> {
  try {
    const response = await nodeFetch(localHookUrl, {
      method: "POST",
      headers: payload.headers,
      body: JSON.stringify(payload.body),
    });
    const responseContext = {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
    };
    try {
      const responseText = await response.text();
      log.debug(
        { responseText, payload, ...responseContext },
        "Response from local"
      );
    } catch (error) {
      log.warn(
        { error, body: payload, ...responseContext },
        "Error occurred while passing to local"
      );
    }
  } catch (error) {
    log.warn({ error, body: payload }, "Cannot request to local");
  }
}
