import "jsr:@std/dotenv/load";
import { cli } from "./src/cli.ts";
import { KVTCPServer } from "./src/tcp_server.ts";
import { KVWebsocketServer } from "./src/websocket_server.ts"; // This line is new

console.log(cli);


if (cli.websocket) {
  // TODO: Implement WebSocket server
  new KVWebsocketServer();
} else {
  console.log("Starting TCP server");
  const server = new KVTCPServer();
  server.start();
}
