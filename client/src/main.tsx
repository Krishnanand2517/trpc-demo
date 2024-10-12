import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  wsLink,
  splitLink,
} from "@trpc/client";
import { AppRouter } from "../../server";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

const wsClient = createWSClient({ url: "ws://localhost:3000/trpc" });

const client = createTRPCProxyClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => {
        return op.type === "subscription";
      },
      true: wsLink({ client: wsClient }),
      false: httpBatchLink({ url: "http://localhost:3000/trpc" }),
    }),
  ],
});

document.addEventListener("click", () => {
  client.users.updateUser.mutate({ userId: "23", name: "Krish New" });
});

async function main() {
  const result1 = await client.sayHi.query();
  console.log(result1);

  const result2 = await client.logToServer.mutate("Hi from client");
  console.log(result2);

  const result3 = await client.users.getUser.query({ userId: "23" });
  console.log(result3);

  // const result4 = await client.users.updateUser.mutate({
  //   userId: "23",
  //   name: "Krish",
  // });
  // console.log(result4);

  const result5 = await client.secretData.query();
  console.log(result5);

  client.users.onUpdate.subscribe(undefined, {
    onData: (id) => {
      console.log(`Updated ${id}`);
    },
  });
}

main();
