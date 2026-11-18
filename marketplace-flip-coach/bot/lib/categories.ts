export type CategoryId =
  | "office_chair"
  | "power_tool"
  | "kitchen_appliance"
  | "fitness_equipment"
  | "other";

export type CategoryGuide = {
  id: CategoryId;
  label: string;
  buyMin: number;
  buyMax: number;
  sellMin: number;
  sellMax: number;
  targetProfitMin: number;
  targetProfitMax: number;
  notes: string;
};

export const CATEGORIES: Record<CategoryId, CategoryGuide> = {
  office_chair: {
    id: "office_chair",
    label: "Office chair",
    buyMin: 15,
    buyMax: 30,
    sellMin: 50,
    sellMax: 75,
    targetProfitMin: 25,
    targetProfitMax: 40,
    notes: "Compact chairs only. Confirm height adjust, wheels, and clean fabric/mesh.",
  },
  power_tool: {
    id: "power_tool",
    label: "Power tool",
    buyMin: 20,
    buyMax: 40,
    sellMin: 55,
    sellMax: 85,
    targetProfitMin: 25,
    targetProfitMax: 40,
    notes: "Check batteries and chargers. Prefer complete cordless kits.",
  },
  kitchen_appliance: {
    id: "kitchen_appliance",
    label: "Kitchen appliance",
    buyMin: 10,
    buyMax: 20,
    sellMin: 30,
    sellMax: 45,
    targetProfitMin: 12,
    targetProfitMax: 20,
    notes: "Test, clean, and photograph. Skip units with missing parts.",
  },
  fitness_equipment: {
    id: "fitness_equipment",
    label: "Fitness equipment",
    buyMin: 15,
    buyMax: 35,
    sellMin: 45,
    sellMax: 75,
    targetProfitMin: 20,
    targetProfitMax: 35,
    notes: "Avoid bulky gym machines. Prefer dumbbells, benches that fit a Kicks.",
  },
  other: {
    id: "other",
    label: "Other compact item",
    buyMin: 10,
    buyMax: 40,
    sellMin: 30,
    sellMax: 80,
    targetProfitMin: 15,
    targetProfitMax: 35,
    notes: "Only when local comps are clear and the item fits the vehicle.",
  },
};

export const STARTING_CAPITAL = 200;
export const CASH_RESERVE_TARGET = 85;
export const CLEANING_FUEL_BUDGET = 30;

export const INITIAL_INVENTORY_BUDGET = {
  office_chair: 30,
  power_tool: 35,
  kitchen_appliance: 20,
} as const;

export type DealInput = {
  category: CategoryId;
  askingPrice: number;
  expectedSellPrice: number;
  desiredProfit: number;
  expenses: number;
  fitsInKicks: boolean;
};

export type DealResult = {
  category: CategoryGuide;
  askingPrice: number;
  expectedSellPrice: number;
  desiredProfit: number;
  expenses: number;
  maxBuyPrice: number;
  offerPrice: number;
  expectedGrossProfitAtAsking: number;
  expectedNetProfitAtAsking: number;
  expectedNetProfitAtOffer: number;
  withinCategoryBuyRange: boolean;
  fitsInKicks: boolean;
  recommendation: "buy" | "offer" | "pass";
  reasons: string[];
};

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

export function evaluateDeal(input: DealInput): DealResult {
  const category = CATEGORIES[input.category];
  const maxBuyPrice = roundMoney(
    input.expectedSellPrice - input.desiredProfit - input.expenses,
  );
  const offerPrice = roundMoney(Math.max(0, Math.min(input.askingPrice, maxBuyPrice)));
  const expectedGrossProfitAtAsking = roundMoney(input.expectedSellPrice - input.askingPrice);
  const expectedNetProfitAtAsking = roundMoney(
    input.expectedSellPrice - input.askingPrice - input.expenses,
  );
  const expectedNetProfitAtOffer = roundMoney(
    input.expectedSellPrice - offerPrice - input.expenses,
  );

  const reasons: string[] = [];
  const withinCategoryBuyRange =
    offerPrice >= category.buyMin && offerPrice <= category.buyMax;

  if (!input.fitsInKicks) {
    reasons.push("Item may not fit a Nissan Kicks — pass unless you verify dimensions.");
  }
  if (maxBuyPrice <= 0) {
    reasons.push("Max buy is at or below $0 at the stated sell/profit/expense targets.");
  }
  if (input.askingPrice > maxBuyPrice) {
    reasons.push(
      `Asking $${input.askingPrice} is above max buy $${maxBuyPrice}. Offer at most $${offerPrice}.`,
    );
  }
  if (!withinCategoryBuyRange && offerPrice > 0) {
    reasons.push(
      `Offer $${offerPrice} is outside the ${category.label} buy guide ($${category.buyMin}–$${category.buyMax}). Still OK if local comps support it.`,
    );
  }
  if (input.expectedSellPrice < category.sellMin || input.expectedSellPrice > category.sellMax) {
    reasons.push(
      `Expected sell $${input.expectedSellPrice} is outside the guide range $${category.sellMin}–$${category.sellMax}. Re-check local comps.`,
    );
  }
  if (input.desiredProfit < category.targetProfitMin) {
    reasons.push(
      `Desired profit $${input.desiredProfit} is below the category floor $${category.targetProfitMin}.`,
    );
  }

  let recommendation: DealResult["recommendation"] = "pass";
  if (
    input.fitsInKicks &&
    maxBuyPrice > 0 &&
    expectedNetProfitAtOffer >= input.desiredProfit * 0.8
  ) {
    if (input.askingPrice <= maxBuyPrice) {
      recommendation = "buy";
      reasons.unshift("Asking price is at or under max buy. Buy if condition checks out.");
    } else if (offerPrice > 0 && offerPrice >= category.buyMin * 0.5) {
      recommendation = "offer";
      reasons.unshift(`Offer $${offerPrice} or less. Do not pay asking.`);
    } else {
      reasons.unshift("No workable offer at the stated targets.");
    }
  } else if (recommendation === "pass" && reasons.length === 0) {
    reasons.push("Deal does not clear profit and fit constraints.");
  }

  return {
    category,
    askingPrice: input.askingPrice,
    expectedSellPrice: input.expectedSellPrice,
    desiredProfit: input.desiredProfit,
    expenses: input.expenses,
    maxBuyPrice,
    offerPrice,
    expectedGrossProfitAtAsking,
    expectedNetProfitAtAsking,
    expectedNetProfitAtOffer,
    withinCategoryBuyRange,
    fitsInKicks: input.fitsInKicks,
    recommendation,
    reasons,
  };
}
