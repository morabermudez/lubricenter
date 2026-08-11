import type { Request, Response } from "express";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config";

const supabase: SupabaseClient = createClient(
  config.supabaseUrl || "https://placeholder.supabase.co",
  config.supabaseKey || "placeholder"
);

const normalizeProduct = (product: any) => ({
  ...product,
  id: product.id_stock,
  name: product.tipo_aceite,
  sku: `ACE-${product.id_stock}`,
  category: "Aceites",
  stock: product.cant_stock,
  critical: product.cant_stock < 10,
  icon: "inventory_2",
  description: product.tipo_aceite,
  price: product.precio,
});

export async function listInventory(_req: Request, res: Response): Promise<void> {
  try {
    const { data, error } = await supabase.from("aceites").select("*");
    if (error) throw error;
    res.json((data ?? []).map(normalizeProduct));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo cargar el inventario" });
  }
}

export async function updateInventory(req: Request, res: Response): Promise<void> {
  try {
    const { data, error } = await supabase
      .from("aceites")
      .update(req.body)
      .or(`id.eq.${req.params.id},id_stock.eq.${req.params.id},id_producto.eq.${req.params.id}`)
      .select();
    if (error) throw error;
    res.json(normalizeProduct(data?.[0] ?? { ...req.body, id: req.params.id }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo actualizar el producto" });
  }
}
