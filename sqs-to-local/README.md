# SQS to Local

Poll events from SQS and call local hook with them.

## Quick start

```bash
# Install dependencies.
yarn

# Build standalone binary.
yarn build

# Start poll server.
./dist/main-PLATFORM # (linux/win.exe/macos)

# Or, jsut start with ts-node for development purpose
yarn start
```

## Environment variables

### Common

It can be set from [`.envrc` file at parent directory](../.envrc.example).

| Name               | Description                    | Required | Default value |
| ------------------ | ------------------------------ | -------- | ------------- |
| TUNNEL_QUEUE_NAME  | Name of SQS to exchange events | true     |               |
| AWS_DEFAULT_REGION | SQS deployed AWS Region        | true     |               |

### for SQS to Local

It can be set from [`.envrc` file at current directory.](.envrc.example).

| Name                  | Description                   | Required | Default value |
| --------------------- | ----------------------------- | -------- | ------------- |
| LOCAL_HOOK_URL        | Hook url in locally installed | true     |               |
| POLL_INTERVAL         | Polling interval (seconds)    | false    | 60            |
| AWS_ACCESS_KEY_ID     | AWS Access key to use SQS     | true     |               |
| AWS_SECRET_ACCESS_KEY | AWS Access key to use SQS     | true     |               |

### for Logging

It can be set from [`.envrc` file at parent directory](../.envrc.example). Or it can be overrided from [`.envrc` file at current directory.](.envrc.example).

| Name              | Description                             | Required | Default value |
| ----------------- | --------------------------------------- | -------- | ------------- |
| CONSOLE_LOG_LEVEL | Log level for Console logging           | false    | trace         |
| SLACK_LOG_LEVEL   | Log level for Slack logging             | false    | warn          |
| SLACK_WEBHOOK_URL | Slack Incoming Webhook URL to send logs | false    | (undefined)   |
| SLACK_USERNAME    | Slack username for logging              | false    | Logger        |
| SLACK_CHANNEL     | Slack channel for logging               | false    | (undefined)   |

## AWS Permission

- sqs:GetQueueUrl
- sqs:ReceiveMessage
- sqs:DeleteMessageBatch

## License

MIT
