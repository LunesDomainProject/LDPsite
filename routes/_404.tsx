import { UnknownPageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function NotFoundPage({ url }: UnknownPageProps) {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
      </Head>
      <main>
        <p>404 not found: {url.pathname}</p>
      </main>
    </>
  );
}
