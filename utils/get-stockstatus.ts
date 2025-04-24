import { StockStatus } from "@/lib/schemas/warehouse.schemas";

// Génère un statut de stock basé sur la quantité actuelle et minimaleexport 
export const getStockStatus = (currentQuantity: number, minimumStock: number, expiryDate?: Date): StockStatus => {
  const ratio = currentQuantity / minimumStock;
  const isExpired = expiryDate ? new Date(expiryDate) < new Date() : false;
  if (isExpired) return StockStatus.EXPIRED;
  if (ratio === 0) return StockStatus.RUPTURE;
  if (ratio < 1) return StockStatus.CRITICAL;
  if (ratio > 1) return StockStatus.NORMAL;
  if (ratio == 1) return StockStatus.MINIMUM_REACHED;
  return StockStatus.NORMAL;
};