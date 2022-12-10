import { Handlers } from "$fresh/server.ts";

const client_id = Deno.env.get("clientId");
const client_secret = Deno.env.get("clientSecret");

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

    const userProfile = await fetch("https://api.github.com/user", {
      headers: {
        accept: "application/json",
        Authorization: `${tokenJson.token_type} ${token}`,
      },
    });

    const userProfileJson = await userProfile.json();

    return new Response(JSON.stringify(userProfileJson), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
