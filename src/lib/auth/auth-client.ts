import { createAuthClient } from "better-auth/react"
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";
// import { clientConfig } from "@/lib/config/client";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  // baseURL: clientConfig.betterAuth.url,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(),
  ]
});
