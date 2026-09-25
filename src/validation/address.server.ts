import xss from "xss";
import { AddressFormSchema } from "./address";

export const addressServerSchema = AddressFormSchema.transform((data) => ({
  ...data,
  label: xss(data.label),
  street: xss(data.street),
  city: xss(data.city),
  state: xss(data.state),
  zip: xss(data.zip),
  country: xss(data.country),
}))
