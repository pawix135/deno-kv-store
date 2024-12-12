import { KVPacket, PACKET_TYPE } from "@pawix/implementation";
import { KVStore } from "./store.ts";

export class KVTCPServer {
  private pckHandler: KVPacket;
  private store: KVStore;
  private server: Deno.TcpListener;

  constructor() {
    this.server = Deno.listen({ port: 6969 });
    this.store = new KVStore();
    this.pckHandler = new KVPacket();
  }

  async start() {
    for await (const conn of this.server) {
      await this.handleConnection(conn);
    }
  }

  async handleConnection(conn: Deno.Conn) {
    try {
      const buffer = new Uint8Array(1024);
      await conn.read(buffer);
      const packet = this.pckHandler.decode(buffer);

      this.store.set(packet.key, packet.payload);

      const responsePacket = this.pckHandler.encode(
        PACKET_TYPE.BOOLEAN,
        "response",
        true,
      );
      await conn.write(responsePacket);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }
}
