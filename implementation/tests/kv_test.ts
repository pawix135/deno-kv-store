import { describe, it } from 'jsr:@std/testing/bdd'
import { KV_PACKET_TYPE, KVPacket } from "../packet.ts";

const kv = new KVPacket()

describe("KV Packet implementation", () => {
  it("should print byte length", () => {

    const xd = kv.encode(KV_PACKET_TYPE.STRING, "Hello, World! Beczke sobie z tego cisnę!");
    const read = kv.decode(xd);


  })
})