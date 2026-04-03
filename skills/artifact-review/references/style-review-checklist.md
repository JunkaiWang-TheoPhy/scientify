# Style Review Checklist

```text
[ ] Every result paragraph contains at least one quantitative statement
[ ] Every comparison sentence names a baseline or comparison target
[ ] Abstract uses only high-confidence claims
[ ] No unsupported adjective inflation appears in headline result sentences
[ ] Observation and interpretation are separable in discussion paragraphs
[ ] Conclusion does not introduce a new claim
[ ] Every figure-backed headline claim has a matching callout before or at first use
[ ] Figures referenced in the text are explained with a takeaway, not just mentioned
[ ] Figure callouts match the claim and do not overstate the caption or evidence boundary
[ ] No paragraph merely restates a figure without adding interpretation or boundary
```

Severity mapping:

- `P0`
  - a headline result sentence has no metric or no baseline
  - the abstract uses a low-confidence claim as a headline result
  - a paragraph presents simulator-only evidence as runtime evidence
- `P1`
  - a results paragraph lacks a boundary or caveat sentence
  - discussion blends observation and interpretation so they cannot be separated
  - a figure is referenced but no takeaway is stated in the text
  - a figure supports a headline claim but the callout/caption/manuscript placement do not line up
- `P2`
  - paragraph is wordy or repetitive
  - wording is vague but still recoverable without changing the scientific claim
  - sentence order weakens readability but not claim safety
