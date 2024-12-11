/**
 * Key-Value Store Packet Implementation
 * @module
 */

export const KV_PACKET_TYPE_LENGTH = 1;
export const KV_PACKET_PAYLOAD_LENGTH = 4;

export enum KV_PACKET_TYPE {
  STRING = 0,
  NUMBER = 1,
  BOOLEAN = 2,
}

export class KVPacket {

  encode(type: KV_PACKET_TYPE, payload: string) {

    const payloadBytes = new TextEncoder().encode(payload);

    const buffer = new ArrayBuffer(KV_PACKET_TYPE_LENGTH + KV_PACKET_PAYLOAD_LENGTH + payloadBytes.length)
    const view = new DataView(buffer);

    let offset = 0;
    view.setInt8(offset, type); offset += 1;
    view.setInt32(1, payloadBytes.length); offset += 4;

    for (let i = 0; i < payloadBytes.length; i++) {
      view.setInt8(offset + i, payloadBytes[i]);
    }

    return buffer;
  }

  decode(bytes: ArrayBuffer) {
    const view = new DataView(bytes);

    let offset = 0;
    const type = view.getInt8(offset); offset += 1;
    const payloadLength = view.getInt32(offset); offset += 4;
    const payload = view.buffer.slice(offset, offset + payloadLength);

    console.log(type, payloadLength, new TextDecoder().decode(payload));

  }

}

