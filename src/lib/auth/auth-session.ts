// src/lib/auth/auth-session.ts
import { UnauthorizedError } from "../http/errors";
import { auth } from "./auth";
import { headers } from "next/headers";

export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new UnauthorizedError(); // map to 401 in withErrorHandling
  return session;
}
