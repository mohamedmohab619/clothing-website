import { NotImplementedError } from "@/lib/errors";
import { toast } from "sonner";
import { mutate } from "swr";

const API = "/api/me/addresses"

// Delete address
export async function handleDeleteAddress(id: number) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    toast.error("Failed to delete address");
    return;
  }

  mutate(API);
  toast.success("Address deleted successfully");
};

// Set default address
export const handleSetDefaultAddress = (newId: number) => {
  throw new NotImplementedError();
};

