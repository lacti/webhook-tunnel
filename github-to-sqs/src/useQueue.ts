import { SQS } from "aws-sdk";
import { logger } from "./logger";
import pMem from "p-memoize";

const log = logger.get("useQueue", __filename);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useQueue() {
  const queueName = process.env.TUNNEL_QUEUE_NAME!;

  const sqs = new SQS();
  async function getQueueUrlWithoutCache(): Promise<string> {
    const result = await sqs
      .getQueueUrl({
        QueueName: queueName,
      })
      .promise();
    log.trace({ queueUrl: result.QueueUrl }, "SQS QueueUrl");
    return result.QueueUrl!;
  }

  const getQueueUrl = pMem(getQueueUrlWithoutCache);

  async function sendMessage(payload: string): Promise<void> {
    const queueUrl = await getQueueUrl();
    const sent = await sqs
      .sendMessage({
        QueueUrl: queueUrl,
        MessageBody: payload,
      })
      .promise();
    log.trace({ sent, payloadLength: payload.length }, "SQS Message sent");
  }

  return { getQueueUrl, sendMessage };
}
