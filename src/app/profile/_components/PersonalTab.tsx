"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth/auth-client";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { SessionUser } from "@/lib/auth/types";

interface PresonalTabProps {
  user: SessionUser,
}

const profileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.email(),
  phoneNumber: z.string(),
  birthDate: z
    .string()
    .refine((v) => v === "" || !Number.isNaN(Date.parse(v)), "Invalid date")
    .refine((v) => v === "" || new Date(v) <= new Date(), "Date can't be in the future"),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function PersonalTab({ user }: PresonalTabProps) {
  // swap `any` for your session user type (see note on inferAdditionalFields below)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty, isSubmitSuccessful },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
    // `values` re-syncs the form if the session loads after first render
    values: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email,
      phoneNumber: user.phoneNumber ?? "",
      birthDate: user.birthDate ? new Date(user.birthDate).toISOString().slice(0, 10) : "",
    },
  });

  async function onSubmit({ firstName, lastName, phoneNumber, birthDate }: ProfileValues) {
    const { error } = await authClient.updateUser({
      name: `${firstName} ${lastName}`, // keep better-auth's required `name` in sync
      firstName,
      lastName,
      phoneNumber: (phoneNumber) ? phoneNumber : null,
      birthDate: birthDate ? new Date(birthDate) : undefined,
    });

    if (error) {
      setError("root", { message: error.message ?? "Something went wrong" });
      toast.error(error.message);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs animate-in fade-in-50 duration-300">
      <div className="border-b border-border pb-4 mb-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Personal Information
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Update your account details and profile information
        </p>
      </div>

      {/* TODO: implement function */}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2">
          <Field data-invalid={!!errors.firstName}>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
            <Input
              id="firstName"
              type="text"
              placeholder="First Name"
              aria-invalid={!!errors.firstName}
              {...register("firstName")}
            />
            {errors.firstName && <FieldError errors={[errors.firstName]} />}
          </Field>

          <Field data-invalid={!!errors.lastName}>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Input
              id="lastName"
              type="text"
              placeholder="Last Name"
              aria-invalid={!!errors.lastName}
              {...register("lastName")}
            />
            {errors.lastName && <FieldError errors={[errors.lastName]} />}
          </Field>
        </FieldGroup>

        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2">
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="myname@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && <FieldError errors={[errors.email]} />}
          </Field>

          <Field data-invalid={!!errors.phoneNumber}>
            <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+20 1000000000"
              aria-invalid={!!errors.phoneNumber}
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && <FieldError errors={[errors.phoneNumber]} />}
          </Field>
        </FieldGroup>

        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2">
          <Field data-invalid={!!errors.birthDate}>
            <FieldLabel htmlFor="birthDate">BirthDate</FieldLabel>
            <Input
              id="birthDate"
              type="date"
              aria-invalid={!!errors.birthDate}
              {...register("birthDate")}
            />
            {errors.birthDate && <FieldError errors={[errors.birthDate]} />}
          </Field>
        </FieldGroup>

        {errors.root && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Update Failed</AlertTitle>
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}
        {isSubmitSuccessful && !isDirty && <p className="text-sm text-muted-foreground">Profile updated.</p>}

        <div className="pt-4 border-t border-border flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || !isDirty}
            className="uppercase tracking-wider font-semibold text-xs px-8 cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>

      </form>
    </div>
  );
}
