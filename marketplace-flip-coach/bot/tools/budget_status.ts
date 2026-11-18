import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";
import { INITIAL_INVENTORY_BUDGET } from "../lib/categories.js";
import { loadLedger, summarizeBudget } from "../lib/ledger.js";

export default defineTool({
  description: prompt`
    Read the current $200 capital plan: cash on hand estimate,
    reserve intact?, inventory cost basis, realized profit, and
    suggested next buy budget. Call when planning purchases or
    reviewing progress toward monthly profit.
  `,
  effect: "read",
  inputSchema: z.object({
    includeEntries: z
      .boolean()
      .default(true)
      .describe("Include the full ledger entries in the response."),
  }),
  async execute({ includeEntries }, ctx) {
    const ledger = await loadLedger(ctx.host.kv);
    const budget = summarizeBudget(ledger);
    const suggestedBuyBudget = Math.max(
      0,
      budget.cashOnHandEstimate - budget.cashReserveTarget,
    );
    return {
      plan: {
        startingCapital: budget.startingCapital,
        preferredStarterBuys: INITIAL_INVENTORY_BUDGET,
        cashReserveTarget: budget.cashReserveTarget,
        cleaningFuelBudget: budget.cleaningFuelBudget,
        month1ProfitTarget: "100-200",
        pathTo1000:
          "Average ~$30 net per item × ~34 sales/month. Grow capital from profits; do not borrow.",
      },
      budget: includeEntries
        ? budget
        : { ...budget, entries: undefined },
      suggestedBuyBudget,
      guidance: budget.reserveIntact
        ? "Reserve looks intact. Prefer deals that keep cash on hand at or above the $85 reserve."
        : "Cash is below the $85 reserve target. Pause routine buys until a sale lands or a standout deal appears.",
    };
  },
});
