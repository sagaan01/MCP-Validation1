import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";
import { loadLedger, saveLedger, summarizeBudget, upsertEntry } from "../lib/ledger.js";

const categorySchema = z.enum([
  "office_chair",
  "power_tool",
  "kitchen_appliance",
  "fitness_equipment",
  "other",
  "ops",
]);

export default defineTool({
  description: prompt`
    Record a purchase, sale, unsold item, or operating expense in the
    durable ledger. Use a stable itemId so repeats are idempotent.
    Call after the user confirms a real buy or sell.
  `,
  effect: "idempotent",
  inputSchema: z.object({
    itemId: z
      .string()
      .min(1)
      .max(80)
      .describe("Stable id for this item (e.g. chair-2026-03-18-a)."),
    item: z.string().min(1).max(120).describe("Short item label."),
    category: categorySchema,
    buyPrice: z.number().nonnegative().describe("What you paid (0 for pure expense rows)."),
    sellPrice: z
      .number()
      .nonnegative()
      .nullable()
      .default(null)
      .describe("Sale price when sold; null otherwise."),
    expenses: z
      .number()
      .nonnegative()
      .default(0)
      .describe("Fuel, cleaning, repairs attributed to this row."),
    status: z.enum(["purchased", "sold", "unsold", "expense"]),
    notes: z.string().max(300).optional(),
  }),
  dryRunResult: (input) => ({
    status: "dry_run",
    itemId: input.itemId,
    recorded: false,
  }),
  async execute(input, ctx) {
    const ledger = await loadLedger(ctx.host.kv);
    const entry = {
      itemId: input.itemId,
      item: input.item,
      category: input.category,
      buyPrice: input.buyPrice,
      sellPrice: input.sellPrice,
      expenses: input.expenses,
      status: input.status,
      notes: input.notes,
      recordedAt: new Date().toISOString(),
    };
    const next = upsertEntry(ledger, entry);
    await saveLedger(ctx.host.kv, next);
    return {
      status: "recorded",
      entry,
      budget: summarizeBudget(next),
    };
  },
});
