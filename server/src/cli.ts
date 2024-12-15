import { parseArgs } from "jsr:@std/cli/parse-args";

export const cli = parseArgs(Deno.args, {
  boolean: ["websocket"],
  alias: {
    "websocket": ["w"],
  },
  default: {
    "websocket": false,
  },
});
