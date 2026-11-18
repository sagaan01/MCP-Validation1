# marketplace-flip-coach

Domain coach for a $200 local Facebook Marketplace flipping business
(buy → clean → list → resell). Tools own deal math and the ledger;
skills hold the 30-day plan and listing template.

## Commands

```bash
npx --yes "@grok/agent-sdk@0.6.0" validate --dir .
npx tsc --noEmit
npx --yes "@grok/agent-sdk@0.6.0" tool call evaluate_deal --dir . --input '{"category":"office_chair","askingPrice":25,"expectedSellPrice":65,"desiredProfit":30,"expenses":5,"fitsInKicks":true}'
npx --yes "@grok/agent-sdk@0.6.0" run --dir . --message "Evaluate a $25 office chair; comps at $65."
npx --yes "@grok/agent-sdk@0.6.0" dev --dir .
```

Model turns need a Cursor credential (`agent-sdk login` or `CURSOR_API_KEY`).
