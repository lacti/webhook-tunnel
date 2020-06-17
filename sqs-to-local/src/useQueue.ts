import { SQS } from "aws-sdk";
import { logger } from "./logger";
import pMem from "p-memoize";

const log = logger.get("poll-server:useQueue", __filename);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useQueue() {
  const queueName = process.env.TUNNEL_QUEUE_NAME!;

  const sqs = new SQS({
    region: process.env.AWS_DEFAULT_REGION ?? "ap-northeast-2",
  });
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

  async function receiveMessage({
    maxNumberOfMesssages = 10,
    waitTimeSeconds = 20,
    visibilityTimeout = 20,
  }: {
    maxNumberOfMesssages?: number;
    waitTimeSeconds?: number;
    visibilityTimeout?: number;
  } = {}): Promise<SQS.MessageList> {
    const queueUrl = await getQueueUrl();
    const received = await sqs
      .receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: maxNumberOfMesssages,
        WaitTimeSeconds: waitTimeSeconds,
        VisibilityTimeout: visibilityTimeout,
      })
      .promise();
    log.trace({ received }, "Messages are received");
    return received.Messages ?? [];
  }

  async function deleteMessage({
    entries,
  }: {
    entries: SQS.DeleteMessageBatchRequestEntryList;
  }): Promise<void> {
    if (entries.length === 0) {
      return;
    }
    const queueUrl = await getQueueUrl();
    const deleted = await sqs
      .deleteMessageBatch({
        QueueUrl: queueUrl,
        Entries: entries,
      })
      .promise();
    log.trace({ entries, deleted }, "Messages are deleted");
  }

  return { receiveMessage, deleteMessage };
}
