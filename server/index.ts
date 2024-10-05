import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { appRouter } from "./routers";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use("/trpc", createExpressMiddleware({ router: appRouter }));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});

export type AppRouter = typeof appRouter;
