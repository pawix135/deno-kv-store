import { describe, it } from 'jsr:@std/testing/bdd'
import { assertEquals } from 'jsr:@std/assert'
import { PACKET_TYPE, KVPacket } from "../packet.ts";

const kvPacket = new KVPacket()

describe("KV Packet Boolean Implementation", () => {

  it("packet with true payload", () => {
    const encodedPacket = kvPacket.encode(PACKET_TYPE.BOOLEAN, "test_1", true);
    const readPacket = kvPacket.decode(encodedPacket);

    assertEquals(readPacket.payload, true);
  })

  it("packet with false payload", () => {
    const encodedPacket = kvPacket.encode(PACKET_TYPE.BOOLEAN, "test_2", false);
    const readPacket = kvPacket.decode(encodedPacket);

    assertEquals(readPacket.payload, false);
  })


})