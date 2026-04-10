import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createSuggestion,
  listSuggestions,
  likeSuggestion,
} from "./db";
import { aiRouter } from "./aiRouter";
import { imageGenRouter } from "./imageGenRouter";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  ai: aiRouter,
  imageGen: imageGenRouter,

  suggestions: router({
    list: publicProcedure.query(async () => {
      return listSuggestions();
    }),

    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1).max(50),
          type: z.enum(["feature", "bug", "improvement", "other"]),
          content: z.string().min(5).max(2000),
        })
      )
      .mutation(async ({ input }) => {
        await createSuggestion({
          name: input.name,
          type: input.type,
          content: input.content,
        });
        return { success: true };
      }),

    like: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await likeSuggestion(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
