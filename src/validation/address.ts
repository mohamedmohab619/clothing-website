import z from "zod";

export const AddressFormSchema = z.object({
  street: z.string().min(3, "Street address must be at least 3 characters long"),
  city: z.string().min(1, "City is required").max(50, "City name is too long").regex(/^[A-Za-z\s\-.'()]+$/, "City name contains invalid characters"),
  state: z.string().min(1, "State is required"),
  zip: z.string(),
  country: z.string().min(1, "Country is required"),
  label: z.string().min(1, "Address label is required").max(50, "Address label is too long"),
  isDefault: z.boolean(),
});

export type TAddressFormSchema = z.infer<typeof AddressFormSchema>;
