import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../../server";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:3000/trpc" })],
});

async function main() {
  const result1 = await client.sayHi.query();
  console.log(result1);

  const result2 = await client.logToServer.mutate("Hi from client");
  console.log(result2);

  const result3 = await client.users.getUser.query();
  console.log(result3);
}

main();
