export default interface Payload {
  headers: {
    [headerKey: string]: string;
  };
  body: unknown;
}
