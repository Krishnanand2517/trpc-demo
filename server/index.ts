import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";

import { appRouter } from "./routers";
import { createContext } from "./context";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use("/trpc", createExpressMiddleware({ router: appRouter, createContext }));

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});

applyWSSHandler({
  wss: new ws.Server({ server }),
  router: appRouter,
  createContext,
});

export type AppRouter = typeof appRouter;
