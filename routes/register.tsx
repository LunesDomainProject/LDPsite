import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies, deleteCookie, setCookie } from "$std/http/mod.ts"
import { encode } from '$std/encoding/base64.ts';

interface Data {
  token: string;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const cookies = getCookies(req.headers);
    const token = cookies.LDPtoken

    console.log(token)

    const forkRequest = await fetch("https://api.github.com/repos/LunesDomainProject/register/forks", {
      method: "POST",
      headers: {
        accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
      },
    });

    const forkJson = await forkRequest.json();

    console.log(forkJson.name)
    const resp = await ctx.render({ token });
    const maxAge = 10 * 60
    setCookie(resp.headers, {
      name: "LDPrepo",
      value: forkJson.name,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge
    })
    setCookie(resp.headers, {
      name: "LDPuser",
      value: forkJson.owner.login,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge
    })
    //resp.headers.set("Set-Cookie", `LDPrepo=${forkJson.name}; path=/; max-age=${maxAge}; SameSite=Lax; secure`)
    //resp.headers.set("Set-Cookie2", `LDPuser=${forkJson.owner.login}; path=/; max-age=${maxAge}; SameSite=Lax; secure`)
    console.log(resp.headers)
    return resp;
  },
  async POST(req: Request) {
    const cookies = getCookies(req.headers);
    const repo = cookies.LDPrepo
    const user = cookies.LDPuser
    const formData = await req.formData()
    const domain = formData.get('name') as string || ""
    console.log(repo, user, domain) 
    console.log(`https://api.github.com/repos/${user}/${repo}/contents/json/${domain.trim()}.json`)
    const fileReq = await fetch(
      `https://api.github.com/repos/${user}/${repo}/contents/json/${domain.trim()}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
          message: `Add domain "${domain}"`,
          content: encode(JSON.stringify({
            owner: {
              username: user
            },
            record: {
              CNAME: domain
            }
          }))
        }),
      },
    );
    
    console.log(fileReq.status)
    const fileJson = await fileReq.json();
    console.log(fileJson)

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

export default function Home({ data }: PageProps<Data>) {
  const token = data.token;
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <main class="p-4 mx-auto max-w-screen-md">
        <form method="POST">
          <label htmlFor="name">test</label>
          <input id="name" type="text" name="name" required/>
          <button type="submit">submit</button>
        </form>
      </main>
    </>
  );
}
