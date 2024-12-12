import { assertEquals } from "jsr:@std/assert";
import { describe, it } from "jsr:@std/testing/bdd";
import { KVTCPServer } from "../../src/tcp_server.ts";
describe("KVTCP Server", () => {
  it("create tcp server", () => {
    const server = new KVTCPServer();
    assertEquals(server instanceof KVTCPServer, true);
  });
});
