import type { HostKvApi, JsonValue } from "@grok/agent-sdk";
import {
  CASH_RESERVE_TARGET,
  CLEANING_FUEL_BUDGET,
  STARTING_CAPITAL,
  type CategoryId,
} from "./categories.js";

export const LEDGER_KEY = "ledger:v1";

export type TxStatus = "purchased" | "sold" | "unsold" | "expense";

export type LedgerEntry = {
  itemId: string;
  item: string;
  category: CategoryId | "ops";
  buyPrice: number;
  sellPrice: number | null;
  expenses: number;
  status: TxStatus;
  notes?: string;
  recordedAt: string;
};

export type Ledger = {
  startingCapital: number;
  cashReserveTarget: number;
  cleaningFuelBudget: number;
  entries: LedgerEntry[];
};

export type BudgetSnapshot = {
  startingCapital: number;
  cashReserveTarget: number;
  cleaningFuelBudget: number;
  cashSpentOnInventory: number;
  cashSpentOnOps: number;
  cashFromSales: number;
  inventoryCostBasis: number;
  grossProfitRealized: number;
  netProfitRealized: number;
  cashOnHandEstimate: number;
  reserveIntact: boolean;
  openPurchases: number;
  soldCount: number;
  entries: LedgerEntry[];
};

function isLedger(value: JsonValue | undefined): value is Ledger {
  if (value === undefined || typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return Array.isArray(v.entries);
}

export function emptyLedger(): Ledger {
  return {
    startingCapital: STARTING_CAPITAL,
    cashReserveTarget: CASH_RESERVE_TARGET,
    cleaningFuelBudget: CLEANING_FUEL_BUDGET,
    entries: [],
  };
}

export async function loadLedger(kv: HostKvApi): Promise<Ledger> {
  const raw = await kv.get(LEDGER_KEY);
  if (!isLedger(raw)) {
    return emptyLedger();
  }
  return {
    startingCapital: Number(raw.startingCapital) || STARTING_CAPITAL,
    cashReserveTarget: Number(raw.cashReserveTarget) || CASH_RESERVE_TARGET,
    cleaningFuelBudget: Number(raw.cleaningFuelBudget) || CLEANING_FUEL_BUDGET,
    entries: raw.entries as LedgerEntry[],
  };
}

export async function saveLedger(kv: HostKvApi, ledger: Ledger): Promise<void> {
  await kv.put(LEDGER_KEY, ledger);
}

export function upsertEntry(ledger: Ledger, entry: LedgerEntry): Ledger {
  const idx = ledger.entries.findIndex((e) => e.itemId === entry.itemId);
  const entries = [...ledger.entries];
  if (idx >= 0) {
    entries[idx] = entry;
  } else {
    entries.push(entry);
  }
  return { ...ledger, entries };
}

export function summarizeBudget(ledger: Ledger): BudgetSnapshot {
  let cashSpentOnInventory = 0;
  let cashSpentOnOps = 0;
  let cashFromSales = 0;
  let inventoryCostBasis = 0;
  let grossProfitRealized = 0;
  let expenseOnSold = 0;
  let openPurchases = 0;
  let soldCount = 0;

  for (const e of ledger.entries) {
    if (e.status === "expense") {
      cashSpentOnOps += e.expenses + e.buyPrice;
      continue;
    }
    cashSpentOnInventory += e.buyPrice;
    cashSpentOnOps += e.expenses;
    if (e.status === "purchased" || e.status === "unsold") {
      inventoryCostBasis += e.buyPrice;
      openPurchases += 1;
    }
    if (e.status === "sold" && e.sellPrice !== null) {
      cashFromSales += e.sellPrice;
      grossProfitRealized += e.sellPrice - e.buyPrice;
      expenseOnSold += e.expenses;
      soldCount += 1;
    }
  }

  const netProfitRealized = grossProfitRealized - expenseOnSold;
  const cashOnHandEstimate =
    ledger.startingCapital - cashSpentOnInventory - cashSpentOnOps + cashFromSales;
  const reserveIntact = cashOnHandEstimate >= ledger.cashReserveTarget;

  return {
    startingCapital: ledger.startingCapital,
    cashReserveTarget: ledger.cashReserveTarget,
    cleaningFuelBudget: ledger.cleaningFuelBudget,
    cashSpentOnInventory: round(cashSpentOnInventory),
    cashSpentOnOps: round(cashSpentOnOps),
    cashFromSales: round(cashFromSales),
    inventoryCostBasis: round(inventoryCostBasis),
    grossProfitRealized: round(grossProfitRealized),
    netProfitRealized: round(netProfitRealized),
    cashOnHandEstimate: round(cashOnHandEstimate),
    reserveIntact,
    openPurchases,
    soldCount,
    entries: ledger.entries,
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
