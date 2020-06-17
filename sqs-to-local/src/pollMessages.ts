import { logger } from "./logger";
import passToLocal from "./passToLocal";
import useQueue from "./useQueue";
import { v4 as uuidv4 } from "uuid";

const log = logger.get("poll-server:pollMessages", __filename);

export default async function pollMessages(): Promise<void> {
  const { receiveMessage, deleteMessage } = useQueue();

  log.trace({}, "Try to poll messsages");
  const messages = await receiveMessage();
  try {
    for (const message of messages.filter((message) => !!message.Body)) {
      await passToLocal({ payload: JSON.parse(message.Body!) });
    }
  } finally {
    const entries = messages
      .filter((message) => message.MessageId && message.ReceiptHandle)
      .map((message) => ({
        Id: message.MessageId ?? uuidv4(),
        ReceiptHandle: message.ReceiptHandle!,
      }));
    try {
      await deleteMessage({ entries });
    } catch (error) {
      log.error(
        { messages, entries, error },
        "Error occurred while deleting messages"
      );
    }
  }
}
