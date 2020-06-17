export default interface Payload {
  headers: {
    "X-GitHub-Event": string;
    "X-GitHub-Delivery": string;
    "Content-Type": string;
    "Content-Length": string;
  };
  body: unknown;
}
