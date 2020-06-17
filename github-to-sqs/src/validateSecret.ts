import * as crypto from "crypto";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export default function validateSecret({
  event: { headers, body },
  secret,
}: {
  event: APIGatewayProxyEvent;
  secret?: string;
}): { pass: boolean; response?: APIGatewayProxyResult } {
  if (!secret) {
    return { pass: true };
  }

  if (!headers["X-Hub-Signature"]) {
    return {
      pass: false,
      response: {
        statusCode: 401,
        headers: { "Content-Type": "text/plain" },
        body: "No Signature",
      },
    };
  }

  if (!headers["X-GitHub-Event"] || !headers["X-GitHub-Delivery"]) {
    return {
      pass: false,
      response: {
        statusCode: 422,
        headers: { "Content-Type": "text/plain" },
        body: "Invalid Payload",
      },
    };
  }

  if (signRequestBody(secret, body ?? "") !== headers["X-Hub-Signature"]) {
    return {
      pass: false,
      response: {
        statusCode: 401,
        headers: { "Content-Type": "text/plain" },
        body: "Invalid Signature",
      },
    };
  }

  return { pass: true };
}

function signRequestBody(key: string, body: string): string {
  return (
    "sha1=" + crypto.createHmac("sha1", key).update(body, "utf8").digest("hex")
  );
}
