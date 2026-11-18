import { defineEval } from "@grok/agent-sdk/evals";

export default defineEval({
  tags: ["smoke"],
  description: "Deal evaluation calls evaluate_deal for a chair listing.",
  async test(t) {
    await t.send(
      "Should I buy this office chair listed at $25? Local comps sell around $65. I want about $30 profit and $5 expenses. It fits in my Kicks and looks clean.",
    );
    t.succeeded();
    t.calledTool("evaluate_deal");
    t.notCalledTool("record_transaction");
  },
});
