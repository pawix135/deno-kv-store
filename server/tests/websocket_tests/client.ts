import { KVPacket, PACKET_TYPE } from '@pawix/implementation'

const packet = new KVPacket();
let socket: WebSocket | null = null;

const createTestWebsocketClient = () => {
  socket = new WebSocket("ws://localhost:80");
  socket.binaryType = "arraybuffer";

  socket.addEventListener("open", () => {
    console.log("Socket opened");
  });

  socket.addEventListener("close", () => {
    console.log("Socket closed");
    socket = createTestWebsocketClient();
  });

  socket.addEventListener("error", (event) => {
    console.log("Socket error:", event);
    socket = createTestWebsocketClient();
  });

  socket.addEventListener("message", (event) => {
    if (event.data instanceof ArrayBuffer) {
      const recivedPacket = packet.decode(new Uint8Array(event.data));
      console.log(recivedPacket);
    }
  });

  return socket
}

socket = createTestWebsocketClient();

setInterval(() => {
  if (!socket) return;
  if (socket.readyState !== 1) return;

  const testPacket = packet.encode(PACKET_TYPE.STRING, "key", "value");
  socket.send(testPacket);

}, 1000)