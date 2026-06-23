export const fetchInventory = async () => {
  const response = await fetch("/api/inventory");
  if (!response.ok) throw new Error("Error fetching inventory");
  return response.json();
};

export const updateInventoryProduct = async (id: string | number, updates: any) => {
  const response = await fetch(`/api/inventory/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) throw new Error("Error updating inventory product");
  return response.json();
};
