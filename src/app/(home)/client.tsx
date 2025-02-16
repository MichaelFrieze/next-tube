"use client";

import { trpc } from "@/trpc/client";

export const PageClient = () => {
  const [data] = trpc.hello.useSuspenseQuery({
    text: "Mike",
  });

  return (
    <div>
      <h1>Page client says: {data.greeting}</h1>
    </div>
  );
};
