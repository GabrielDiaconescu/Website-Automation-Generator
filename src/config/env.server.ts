import "server-only";

import { z } from "zod";

import { parseEnv } from "@/lib/validation/parse-env";

// Secrets belong here only. Importing this module from a client component is a
// build error, which is what keeps service keys out of the browser bundle.
const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export const serverEnv = parseEnv(
  serverEnvSchema,
  {
    NODE_ENV: process.env.NODE_ENV,
    LOG_LEVEL: process.env.LOG_LEVEL,
  },
  "server",
);

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const isProduction = serverEnv.NODE_ENV === "production";
export const isDevelopment = serverEnv.NODE_ENV === "development";
