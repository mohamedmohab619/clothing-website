"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { AddressFormSchema, TAddressFormSchema } from "@/validation/address";
import { toast } from "sonner";
import { useAddress } from "@/hooks/useAddress";
import { Checkbox } from "@/components/ui/checkbox";
import { mutate } from "swr";

interface AddressModalProps {
  isAddressModalOpen: boolean,
  setIsAddressModalOpen: Dispatch<SetStateAction<boolean>>
}

export function AddressModal({ isAddressModalOpen, setIsAddressModalOpen }: AddressModalProps) {
  // const { addressCount, isLoading } = useAddress();
  // const isFirstAddress = !isLoading && addressCount === 0;

  // -------
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty, isSubmitSuccessful }
  } = useForm<TAddressFormSchema>({
    resolver: zodResolver(AddressFormSchema),
    mode: "onTouched",
    defaultValues: { isDefault: false },
  });


  async function onSubmit(data: TAddressFormSchema) {
    const response = await fetch("/api/me/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast.success("Address created successfully");
      setTimeout(() => setIsAddressModalOpen(false), 500)
      mutate("/api/me/addresses");
    } else {
      toast.error("Error creating address");
    }
  }
  //------

  // useEffect(() => {
  //   if (isFirstAddress) {
  //     setValue("isDefault", true, { shouldValidate: true });
  //   }
  // }, [isFirstAddress, setValue]);

  return (
    <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
          <DialogDescription>
            Enter your shipping destination details below.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Field data-invalid={!!errors.label}>
            <FieldLabel htmlFor="label" className="text-xs font-semibold">
              Label <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="label"
              type="text"
              placeholder="Home, Work, Dad's House, Friend's House, etc.."
              aria-invalid={!!errors.label}
              {...register("label")}
            />
            {errors.label && <FieldError errors={[errors.label]} />}
          </Field>

          <Field data-invalid={!!errors.street}>
            <FieldLabel htmlFor="street" className="text-xs font-semibold">
              Street Address <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="street"
              type="text"
              placeholder="123 Fashion Blvd"
              aria-invalid={!!errors.street}
              {...register("street")}
            />
            {errors.street && <FieldError errors={[errors.street]} />}
          </Field>

          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2">
            <Field data-invalid={!!errors.city}>
              <FieldLabel htmlFor="city" className="text-xs font-semibold">
                City <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="city"
                type="text"
                placeholder="Los Angeles"
                aria-invalid={!!errors.city}
                {...register("city")}
              />
              {errors.city && <FieldError errors={[errors.city]} />}
            </Field>

            <Field data-invalid={!!errors.state}>
              <FieldLabel htmlFor="state" className="text-xs font-semibold">
                State <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="state"
                type="text"
                placeholder="CA"
                aria-invalid={!!errors.state}
                {...register("state")}
              />
              {errors.state && <FieldError errors={[errors.state]} />}
            </Field>
          </FieldGroup>

          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2">
            <Field data-invalid={!!errors.zip}>
              <FieldLabel htmlFor="zip" className="text-xs font-semibold">
                Zip Code
              </FieldLabel>
              <Input
                id="zip"
                type="text"
                placeholder="90001"
                aria-invalid={!!errors.zip}
                {...register("zip")}
              />
              {errors.zip && <FieldError errors={[errors.zip]} />}
            </Field>

            <Field data-invalid={!!errors.country}>
              <FieldLabel htmlFor="country" className="text-xs font-semibold">
                Country <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="country"
                type="tel"
                placeholder="United States"
                aria-invalid={!!errors.country}
                {...register("country")}
              />
              {errors.country && <FieldError errors={[errors.country]} />}
            </Field>
          </FieldGroup>

          <Field orientation="horizontal" data-invalid={!!errors.isDefault}>
            <Checkbox
              id="isDefault"
              aria-invalid={!!errors.isDefault}
              className="cursor-pointer"
              {...register("isDefault")}
            />
            <FieldLabel htmlFor="isDefault" className="text-xs font-semibold">
              Set as default address
            </FieldLabel>
            {errors.isDefault && <FieldError errors={[errors.isDefault]} />}
          </Field>

          {errors.root && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Update Failed</AlertTitle>
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}
          {isSubmitSuccessful && !isDirty && <p className="text-sm text-muted-foreground">Profile updated.</p>}

          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddressModalOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="uppercase tracking-wider font-semibold text-xs px-8 cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Save Address"}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}
