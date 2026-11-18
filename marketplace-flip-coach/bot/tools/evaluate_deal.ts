import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";
import { evaluateDeal, type CategoryId } from "../lib/categories.js";

const categorySchema = z.enum([
  "office_chair",
  "power_tool",
  "kitchen_appliance",
  "fitness_equipment",
  "other",
]);

export default defineTool({
  description: prompt`
    Score a Facebook Marketplace (or local) listing before buying.
    Call this for every purchase decision. Returns max buy price,
    offer price, expected net profit, and buy/offer/pass.
    Formula: maxBuy = expectedSell − desiredProfit − expenses.
  `,
  effect: "read",
  inputSchema: z.object({
    category: categorySchema.describe("Closest product category."),
    askingPrice: z.number().nonnegative().describe("Seller asking price in USD."),
    expectedSellPrice: z
      .number()
      .positive()
      .describe("Realistic local resale price from comps, not retail MSRP."),
    desiredProfit: z
      .number()
      .positive()
      .default(25)
      .describe("Target net profit after expenses."),
    expenses: z
      .number()
      .nonnegative()
      .default(5)
      .describe("Expected fuel, cleaning, minor parts for this item."),
    fitsInKicks: z
      .boolean()
      .default(true)
      .describe("Whether the item fits in a Nissan Kicks for local pickup."),
    conditionSummary: z
      .string()
      .max(500)
      .optional()
      .describe("Brief condition notes from the listing or inspection."),
  }),
  async execute(input) {
    const result = evaluateDeal({
      category: input.category as CategoryId,
      askingPrice: input.askingPrice,
      expectedSellPrice: input.expectedSellPrice,
      desiredProfit: input.desiredProfit,
      expenses: input.expenses,
      fitsInKicks: input.fitsInKicks,
    });
    return {
      ...result,
      conditionSummary: input.conditionSummary ?? null,
      rule: "maxBuy = expectedSell − desiredProfit − expenses",
      reminder:
        "Never buy on claimed original retail. Compare local used comps. First goal is protecting the $200 capital.",
    };
  },
});
