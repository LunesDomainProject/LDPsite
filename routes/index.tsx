import { Head } from "$fresh/runtime.ts";
import Counter from "../islands/Counter.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";

interface EnvVars {
  client_id: string,
}

export const handler: Handlers<EnvVars> = {
  GET(_req, ctx) {
    const client_id = Deno.env.get("client_id") || ""
    return ctx.render({ client_id });
  },
};

export default function Home({ data }: PageProps<EnvVars>) {
  const client_id = data.client_id
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <img
          src="/logo.svg"
          class="w-32 h-32"
          alt="the fresh logo: a sliced lemon dripping with juice"
        />
        <p class="my-6">
          Welcome to `fresh`. Try updating this message in the
          ./routes/index.tsx file, and refresh.
        </p>
        <Counter start={3} />
      </div>
    </>
  );
}
