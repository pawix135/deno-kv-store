import { describe, it } from 'jsr:@std/testing/bdd'
import { assertEquals } from 'jsr:@std/assert'
import { PACKET_TYPE, KVPacket } from "../packet.ts";

const kvPacket = new KVPacket()

describe("KV Packet Number Implementation", () => {

  it("packet with integer", () => {
    const encodedPacket = kvPacket.encode(PACKET_TYPE.NUMBER, "test_1", 1);
    const readPacket = kvPacket.decode(encodedPacket);

    assertEquals(readPacket.payload, 1);
  })

  it("packet with float", () => {
    const encodedPacket = kvPacket.encode(PACKET_TYPE.NUMBER, "test_2", 13.37);
    const readPacket = kvPacket.decode(encodedPacket);

    assertEquals(readPacket.payload, 13.37);
  })

  it("packet with min safe integer", () => {
    const encodedPacket = kvPacket.encode(PACKET_TYPE.NUMBER, "test_3", Number.MIN_SAFE_INTEGER);
    const readPacket = kvPacket.decode(encodedPacket);

    assertEquals(readPacket.payload, Number.MIN_SAFE_INTEGER);
  })

  it("packet with max safe integer", () => {
    const encodedPacket = kvPacket.encode(PACKET_TYPE.NUMBER, "test_4", Number.MAX_SAFE_INTEGER);
    const readPacket = kvPacket.decode(encodedPacket);

    assertEquals(readPacket.payload, Number.MAX_SAFE_INTEGER);
  })


})