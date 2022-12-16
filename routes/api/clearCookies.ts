import { Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/mod.ts"

export const handler: Handlers = {
  GET(_req: Request) {
    const headers = new Headers();
    headers.set("location", "/")
    deleteCookie(headers, "LDPrepo");
    deleteCookie(headers, "LDPuser");
    deleteCookie(headers, "LDPtoken");
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
