import { defineEval } from "@grok/agent-sdk/evals";

export default defineEval({
  tags: ["deal"],
  description: "Overpriced asking triggers evaluate_deal and an offer/pass path.",
  async test(t) {
    await t.send(
      "Power tool asking $70. I think I can resell for $80. Want $30 profit, $5 expenses, fits in Kicks. Battery included. Evaluate it.",
    );
    t.succeeded();
    t.calledTool("evaluate_deal");
  },
});
