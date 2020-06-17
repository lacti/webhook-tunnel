import { flushSlack, logger } from "./logger";

import pollMessages from "./pollMessages";
import sleep from "./sleep";

const log = logger.get("poll-server:main", __filename);
const sleepInterval = +(process.env.POLL_INTERVAL ?? "60");

async function main() {
  while (true) {
    try {
      await pollMessages();
    } catch (error) {
      log.error({ error }, "Cannot polling from SQS");
    }
    await flushSlack();
    await sleep(sleepInterval * 1000);
  }
}

main().catch((error) => {
  log.error({ error }, "Error from poll-server");
});
