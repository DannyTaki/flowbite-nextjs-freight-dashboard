import { z } from "zod";

export const optsSchema = z.object({
  orderNumber: z
    .string()
    .trim()
    .min(1, {
      message: "Order number must be at least 1 character long",
    })
    .max(25, {
      message: "Order number must be at most 25 characters long",
    }),
});
