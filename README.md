# Webhook-tunnel

[ngrok](https://ngrok.com/) is good to make a tunnel for private network.

But in my case, to make a hook between GitHub and Jenkins in my local, I worry few things below.

- Someone can guess my ngrok URL mapped brute force,
- and there is no way to protect my Jenkins access except Basic authentication supported by ngrok
- but that method cannot be supported by GitHub WebHook.

Of course, introducing nginx to expose only Jenkins' WebHook URL and use ngrok that path, everything would be alright. But I can only 1 online ngrok process under free plan.

So I made it.

## Architecture

```text
GitHub -> APIGW/λ -> SQS (Public network)
   (Private network) SQS <- polling server -> Jenkins
```

## Quick start

1. Setup [environment variables.](.envrc.example)
2. Deploy [`github-to-sqs`](github-to-sqs) into AWS.
3. Setup [`sqs-to-loacl`](sqs-to-local) in local machine.


## Environment variables

Checkout [`.envrc`](.envrc.example) file please.

## License

MIT

