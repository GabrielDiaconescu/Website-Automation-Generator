import { z } from "zod";

import { parseEnv } from "@/lib/validation/parse-env";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
});

// Next.js inlines NEXT_PUBLIC_* only when referenced as a static property
// access, so the keys cannot be read through a loop or a computed key.
export const clientEnv = parseEnv(
  clientEnvSchema,
  {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  "client",
);

export type ClientEnv = z.infer<typeof clientEnvSchema>;
