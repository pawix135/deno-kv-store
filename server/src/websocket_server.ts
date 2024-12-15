import { KVPacket, PACKET_TYPE } from '@pawix/implementation'
import { KVStore } from "./store.ts";

export class KVWebsocketServer {

  private store: KVStore
  private pckHandler: KVPacket
  private server: Deno.HttpServer<Deno.NetAddr>
  private listeners: Map<WebSocket, string>

  constructor() {
    this.listeners = new Map();
    this.store = new KVStore()
    this.pckHandler = new KVPacket()
    this.server = this.initializeHTTPServer()
  }

  private initializeHTTPServer() {
    return Deno.serve({ port: 80 }, (req) => {

      if (req.headers.get("upgrade") != "websocket") {
        return new Response(null, { status: 501 });
      }

      const { socket, response } = Deno.upgradeWebSocket(req);
      socket.binaryType = "arraybuffer"


      socket.addEventListener("open", () => {
        const id = crypto.randomUUID();
        this.handleSocketConnection(socket, id);
      })

      socket.addEventListener("close", () => {
        this.handleSocketClose(socket);
      })

      socket.addEventListener("error", (event) => {
        console.log("Socket error", (event as ErrorEvent).message);
      })

      socket.addEventListener("message", (event) => {
        this.handleSocketMessage(socket, event.data);

      })

      return response
    })
  }

  private handleSocketClose(socket: WebSocket) {
    this.listeners.delete(socket);
  }

  private handleSocketConnection(socket: WebSocket, id: string) {
    this.listeners.set(socket, id);
  }

  private handleSocketMessage(socket: WebSocket, data: unknown) {

    if (typeof data !== "object" && !(data instanceof ArrayBuffer)) {
      console.log('[SOCKET] Invalid data type');
      socket.close(1003, "Invalid data type");
      return;
    }

    const rawPacket = data as ArrayBuffer;
    const packet = this.pckHandler.decode(new Uint8Array(rawPacket));

    this.store.set(packet.key, packet.payload);

    const responsePacket = this.pckHandler.encode(PACKET_TYPE.BOOLEAN, "response", true);
    console.log(packet);

    socket.send(responsePacket);
  }

}