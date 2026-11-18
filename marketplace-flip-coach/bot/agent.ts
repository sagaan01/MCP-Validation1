import { defineAgent } from "@grok/agent-sdk";

export default defineAgent({
  name: "marketplace-flip-coach",
  description:
    "Coaches a $200 local Marketplace flipping business: deal math, capital tracking, 30-day plan, and listing help.",
  model: {
    id: "grok-4.7",
    params: [
      { id: "reasoning_effort", value: "high" },
      { id: "fast", value: "true" },
    ],
  },
});
