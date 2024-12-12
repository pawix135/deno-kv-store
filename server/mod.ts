import "jsr:@std/dotenv/load";
import { cli } from "./src/cli.ts";
import { KVTCPServer } from "./src/tcp_server.ts";

if (cli.websocket) {
  // TODO: Implement WebSocket server
  console.log("Starting WebSocket server");
} else {
  console.log("Starting TCP server");
  const server = new KVTCPServer();
  server.start();
}
