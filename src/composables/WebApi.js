/* The code is setting the values of the `server` and `websocket` constants based on the value of the
`process.env.DEV` environment variable. */
const server = process.env.DEV
  ? "http://127.0.0.1:8080"
  : "http://127.0.0.1:8080";

const websocket = process.env.DEV
  ? "ws://127.0.0.1:8080"
  : "ws://127.0.0.1:8080";

export const webApi = {
  server,
  websocket,
};
