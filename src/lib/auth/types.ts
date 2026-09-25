import { authClient } from "./auth-client";

export type SessionUser = typeof authClient.$Infer.Session.user;
