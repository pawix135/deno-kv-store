import { bytesToText } from '@pawix/implementation'

/**
 * Key-Value Store Packet Implementation
 * @module
 */

export const PACKET_TYPE_LENGTH = 1
export const PACKET_KEY_LENGTH = 2;
export const PACKET_PAYLOAD_LENGTH = 2;
export const PACKET_MAX_KEY_LENGTH = 32;

export enum PACKET_TYPE {
  STRING = 0,
  NUMBER = 1,
  BOOLEAN = 2,
}

export class KVPacket {

  encode(type: PACKET_TYPE, key: string, payload: string | number | boolean) {

    // deno-lint-ignore valid-typeof
    if (this.typeToPayloadType(type) !== typeof payload) throw Error("Type mismatch")

    let payloadBytes: Uint8Array;
    switch (type) {
      case PACKET_TYPE.STRING:
        payloadBytes = new TextEncoder().encode(payload as string);
        break;
      case PACKET_TYPE.NUMBER:
        payloadBytes = new Uint8Array(this.toBytes(payload as number));
        break;
      case PACKET_TYPE.BOOLEAN:
        payloadBytes = new Uint8Array([payload as boolean ? 1 : 0]);
        break;
      default:
        throw new Error("Unknown packet type")
    }
    const keyBytes = new TextEncoder().encode(key);

    const bufferSize = PACKET_TYPE_LENGTH + PACKET_KEY_LENGTH + PACKET_PAYLOAD_LENGTH + key.length + payloadBytes.length;
    const buffer = new ArrayBuffer(bufferSize)
    const view = new DataView(buffer);

    let offset = 0;
    view.setInt8(offset, type); offset += PACKET_TYPE_LENGTH;
    view.setInt16(offset, keyBytes.length); offset += PACKET_KEY_LENGTH;
    view.setInt16(offset, payloadBytes.length); offset += PACKET_PAYLOAD_LENGTH;

    for (let i = 0; i < keyBytes.length; i++) {
      view.setInt8(offset, keyBytes[i]); offset += 1;
    }

    for (let i = 0; i < payloadBytes.length; i++) {
      view.setInt8(offset, payloadBytes[i]); offset += 1;
    }

    return new Uint8Array(buffer);
  }

  typeToPayloadType(type: PACKET_TYPE) {
    switch (type) {
      case PACKET_TYPE.STRING:
        return "string";
      case PACKET_TYPE.NUMBER:
        return "number";
      case PACKET_TYPE.BOOLEAN:
        return "boolean";
      default:
        throw new Error("Unknown packet type")
    }
  }

  decode(bytes: Uint8Array) {

    const view = new DataView(bytes.buffer);

    let offset = 0;

    const type = view.getInt8(offset); offset += PACKET_TYPE_LENGTH;
    const keyLength = view.getInt16(offset); offset += PACKET_KEY_LENGTH;
    const payloadLength = view.getInt16(offset); offset += PACKET_PAYLOAD_LENGTH;

    const key = bytesToText(view.buffer.slice(offset, offset + keyLength)); offset += keyLength;
    const payload = view.buffer.slice(offset, offset + payloadLength);

    let decodedPayload: string | number | boolean | undefined = undefined;
    switch (type) {
      case PACKET_TYPE.STRING:
        decodedPayload = bytesToText(payload);
        break;
      case PACKET_TYPE.BOOLEAN:
        decodedPayload = view.getInt8(offset) === 1;
        break;
      case PACKET_TYPE.NUMBER:
        decodedPayload = this.fromBytes(new Uint8Array(payload));

        break;
      default:
        decodedPayload = undefined;
        throw new Error("Unknown packet type")
    }

    return {
      type,
      key,
      payload: decodedPayload
    }
  }

  fromBytes(buffer: Uint8Array): number {
    const view = new DataView(buffer.buffer);
    if (buffer.length === 4) {
      return view.getFloat32(0, true);
    } else if (buffer.length === 8) {
      return view.getFloat64(0, true);
    } else if (buffer.length === 2) {
      return view.getInt16(0, true);
    } else if (buffer.length === 1) {
      return view.getInt8(0);
    } else {
      throw new Error("Unsupported buffer length");
    }
  }

  toBytes(number: number): Uint8Array {
    if (!Number.isFinite(number)) {
      throw new Error("Number is out of range");
    }

    if (Number.isInteger(number)) {
      if (number >= -128 && number <= 127) {
        const buffer = new ArrayBuffer(1);
        const view = new DataView(buffer);
        view.setInt8(0, number);
        return new Uint8Array(buffer);
      } else if (number >= -32768 && number <= 32767) {
        const buffer = new ArrayBuffer(2);
        const view = new DataView(buffer);
        view.setInt16(0, number, true);
        return new Uint8Array(buffer);
      } else if (number >= -2147483648 && number <= 2147483647) {
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setInt32(0, number, true);
        return new Uint8Array(buffer);
      } else {
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);
        view.setFloat64(0, number, true);
        return new Uint8Array(buffer);
      }
    } else {
      const buffer = new ArrayBuffer(8);
      const view = new DataView(buffer);
      view.setFloat64(0, number, true);
      return new Uint8Array(buffer);
    }
  }


}
