"use client";
import { useForm } from 'react-hook-form';
import { Input } from "../../../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { PasswordInput } from '@/components/ui/password-input';
import { Controller } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"

export function SignInTab({
  openForgotPasswordTab,
}: {
  openForgotPasswordTab: () => void
}) {
  const router = useRouter();

  const signinSchema = z.object({
    email: z.email().min(1),
    password: z.string().min(1),
  });

  type signinForm = z.infer<typeof signinSchema>;

  const form = useForm<signinForm>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const { isSubmitting } = form.formState;

  async function handleSignin(data: signinForm) {
    await authClient.signIn.email({ ...data }, {
      onError: (error) => {
        console.log(error);
        // if (error.error.code == "EMAIL_NOT_VERIFIED") {
        //   openVerificationTab(data.email)
        // }
        toast.error(error.error.message || "Failed to sign in");
      },
      onSuccess: () => {
        router.push("/");
      }
    })
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={form.handleSubmit(handleSignin)}
        className="space-y-4"
      >
        <FieldGroup>
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="signin-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="signin-email"
                  type="email"
                  autoComplete="email webauthn"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="signin-password">Password</FieldLabel>
                  <Button
                    type="button"
                    variant="link"
                    onClick={openForgotPasswordTab}
                    className="cursor-pointer"
                  >
                    Forgot Password?
                  </Button>
                </div>
                <PasswordInput
                  {...field}
                  id="signin-password"
                  autoComplete="current-password webauthn"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* TODO: confirm password field */}
        </FieldGroup>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer"
          size="lg"
        >
          <LoadingSwap isLoading={isSubmitting}>Submit</LoadingSwap>
        </Button>
      </form>

      {/* <PasskeysButton /> */}
    </div>
  )
}
