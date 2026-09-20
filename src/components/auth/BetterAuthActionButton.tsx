"use client";

import { ComponentProps } from "react"
import { ActionButton } from "@/components/ui/action-button";

/**
 * components/auth/BetterAuthActionButton
 * A wrapper around the ActionButton Component from "Web Dev Simplified" YT channel
 */
export function BetterAuthActionButton({
  action,
  successMessage,
  ...props
}: Omit<ComponentProps<typeof ActionButton>, "action"> & {
  action: () => Promise<{ error: null | { message?: string } }>
  successMessage?: string
}) {
  return (
    <ActionButton
      {...props}
      action={async () => {
        const res = await action();

        if (res.error) {
          return { error: true, message: res.error.message || "Action failed" };
        } else {
          return { error: false, message: successMessage };
        }
      }}
    />
  )
}
