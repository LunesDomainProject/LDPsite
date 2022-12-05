import { Handlers, PageProps } from "$fresh/server.ts";

interface Props {
  name: string;
}

export const handler: Handlers<Props> = {
  GET(_req, ctx) {
    if (ctx.params.name === "404") {
      return ctx.renderNotFound();
    }

    return ctx.render({ name: ctx.params.name });
  }
};

export default function Greet(props: PageProps<Props>) {
  return <div>Hello {props.params.name}</div>;
}
