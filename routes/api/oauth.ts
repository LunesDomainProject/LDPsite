import { Handlers } from "$fresh/server.ts";

const client_id = Deno.env.get("client_id");
const client_secret = Deno.env.get("client_secret");

export const handler: Handlers = {
  async GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    const tokenReq = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          code,
          client_id,
          client_secret,
        }),
      },
    );

    const tokenJson = await tokenReq.json();
    const token = tokenJson.access_token;

    const headers = new Headers();
    const maxAge = 10 * 60 // 10 minutes
    headers.set("location", "/register");
    headers.set("Set-Cookie", `LDPtoken=${token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`)
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
