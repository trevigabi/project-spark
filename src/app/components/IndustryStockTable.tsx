import { useState } from "react";
import { industryStockItems, type StockItem } from "../data/stockData";
import { StockTable } from "./StockTable";

interface IndustryStockTableProps {
  /** Rep (e demais perfis sem gestão) só enxergam os dados, sem controles de edição. */
  readOnly?: boolean;
}

export function IndustryStockTable({ readOnly = false }: IndustryStockTableProps) {
  const [items, setItems] = useState<StockItem[]>(industryStockItems);

  const updateStock = (sku: string, stock: number) => {
    setItems(prev => prev.map(it => it.sku === sku ? { ...it, stock, updatedAt: new Date().toISOString().slice(0, 10) } : it));
  };

  return (
    <StockTable
      items={items}
      onUpdateStock={readOnly ? undefined : updateStock}
      readOnly={readOnly}
      showBulkActions
    />
  );
}
