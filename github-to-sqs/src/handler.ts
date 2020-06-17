import "source-map-support/register";

import { flushSlack, logger } from "./logger";

import { APIGatewayProxyHandler } from "aws-lambda";
import Payload from "./payload";
import useQueue from "./useQueue";
import validateSecret from "./validateSecret";

const log = logger.get("webhook", __filename);

export const webhook: APIGatewayProxyHandler = async (event) => {
  const { pass, response } = validateSecret({
    event,
    secret: process.env.WEBHOOK_SECRET,
  });
  if (!pass) {
    log.warn(response, "Invalid request");
    return response!;
  }

  const jsonBody = JSON.parse(event.body!);
  const payload: Payload = {
    headers: {
      "X-GitHub-Event": event.headers["X-GitHub-Event"],
      "X-GitHub-Delivery": event.headers["X-GitHub-Delivery"],
      "Content-Type": "application/json",
      "Content-Length": JSON.stringify(jsonBody).length.toString(),
    },
    body: jsonBody,
  };

  const serialized = JSON.stringify(payload);
  log.trace({ payload }, "GitHub Payload");
  log.info({ payloadLength: serialized.length }, "GitHub Payload length");

  const { sendMessage } = useQueue();
  await sendMessage(serialized);

  await flushSlack();
  return {
    statusCode: 200,
    body: "true",
  };
};
