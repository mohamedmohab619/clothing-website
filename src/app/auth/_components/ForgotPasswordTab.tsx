"use client";
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { Controller } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"

export function ForgotPasswordTab({
  openSignInTab
}: { openSignInTab: () => void }) {
  const forgotPasswordSchema = z.object({
    email: z.email().min(1),
  });

  type forgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

  const form = useForm<forgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    }
  });

  const { isSubmitting } = form.formState

  async function handleSubmit(data: forgotPasswordForm) {
    await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: '/auth/reset-password'
    }, {
      onError: (error) => {
        toast.error(
          error.error.message || "Failed to send password reset email"
        );
      },
      onSuccess: () => {
        toast.success('Password reset email sent');
      }
    })
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="forgot-password-email">Email</FieldLabel>
              <Input
                {...field}
                id="forgot-password-email"
                type="email"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex gap-4">
        <Button
          type="button"
          size="lg"
          variant="outline"
          onClick={openSignInTab}
          className="cursor-pointer flex-1"
        >
          Go Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer flex-6"
          size="lg"
        >
          <LoadingSwap isLoading={isSubmitting}>Submit</LoadingSwap>
        </Button>
      </div>
    </form>
  )
}
