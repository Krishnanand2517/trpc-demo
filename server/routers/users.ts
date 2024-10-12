import { observable } from "@trpc/server/observable";
import { t } from "../trpc";
import { z } from "zod";
import { EventEmitter } from "stream";

const userProcedure = t.procedure.input(z.object({ userId: z.string() }));
const eventEmitter = new EventEmitter();

export const userRouter = t.router({
  getUser: userProcedure.query(({ input }) => {
    return { id: input.userId };
  }),
  updateUser: userProcedure
    .input(z.object({ name: z.string() }))
    .mutation((req) => {
      console.log(`isAdmin: ${req.ctx.isAdmin}`);

      console.log(
        `Updating user ${req.input.userId} to have the name ${req.input.name}`
      );

      eventEmitter.emit("updateUser", req.input.userId);

      return { id: req.input.userId, name: req.input.name };
    }),
  onUpdate: t.procedure.subscription(() => {
    return observable<string>((emit) => {
      eventEmitter.on("updateUser", emit.next);

      return () => {
        eventEmitter.off("updateUser", emit.next);
      };
    });
  }),
});
