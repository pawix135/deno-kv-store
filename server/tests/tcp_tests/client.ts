import { KVPacket, PACKET_TYPE } from "@pawix/implementation";

const client = await Deno.connect({ hostname: "127.0.0.1", port: 6969 });

const pckHandler = new KVPacket();

const packet = pckHandler.encode(PACKET_TYPE.STRING, "name", "Pawix");

await client.write(packet);
const responseBuffer = new Uint8Array(1024);
await client.read(responseBuffer);
const decoded = pckHandler.decode(responseBuffer);
console.log(decoded);
