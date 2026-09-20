
// Add new address
export const handleAddAddress = (e: React.FormEvent) => {
  e.preventDefault();
  if (!newAddrName.trim() || !newAddrStreet.trim() || !newAddrCity.trim() || !newAddrZip.trim()) {
    toast.error("Please fill in all required address fields");
    return;
  }

  const newAddr: Address = {
    id: `addr-${Date.now()}`,
    name: newAddrName,
    street: newAddrStreet,
    city: newAddrCity,
    state: newAddrState || "CA",
    zip: newAddrZip,
    country: newAddrCountry,
    isDefault: addresses.length === 0,
    type: "shipping",
  };

  setAddresses((prev) => [...prev, newAddr]);
  setIsAddressModalOpen(false);
  setNewAddrName("");
  setNewAddrStreet("");
  setNewAddrCity("");
  setNewAddrZip("");
  toast.success("New address saved successfully!");
};

// Delete address
export const handleDeleteAddress = (id: string) => {
  setAddresses((prev) => prev.filter((a) => a.id !== id));
  toast.success("Address removed");
};

// Set default address
export const handleSetDefaultAddress = (id: string) => {
  setAddresses((prev) =>
    prev.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }))
  );
  toast.success("Default address updated");
};

// Add new card
export const handleAddCard = (e: React.FormEvent) => {
  e.preventDefault();
  if (newCardNumber.replace(/\s/g, "").length < 15 || !newCardHolder || !newCardExpiry) {
    toast.error("Please enter valid card details");
    return;
  }

  const newCard: SavedCard = {
    id: `card-${Date.now()}`,
    brand: newCardNumber.startsWith("4") ? "Visa" : "Mastercard",
    last4: newCardNumber.slice(-4),
    expiry: newCardExpiry,
    holder: newCardHolder.toUpperCase(),
    isDefault: cards.length === 0,
  };

  setCards((prev) => [...prev, newCard]);
  setIsCardModalOpen(false);
  setNewCardNumber("");
  setNewCardHolder("");
  setNewCardExpiry("");
  toast.success("New payment method saved!");
};

// Delete card
export const handleDeleteCard = (id: string) => {
  setCards((prev) => prev.filter((c) => c.id !== id));
  toast.success("Card removed");
};

// Buy item again from order history
export const handleBuyAgain = (item: OrderItem) => {
  addToCart({
    id: item.id,
    title: item.title,
    price: item.price,
    image: item.image,
    quantity: 1,
    selectedColor: item.color,
    selectedSize: item.size,
  });
  toast.success(`Added "${item.title}" back to cart!`);
};
