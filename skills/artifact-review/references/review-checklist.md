# Release Checklist

```text
[Required]
[ ] Every headline metric includes a baseline
[ ] Every headline metric includes a source artifact path
[ ] Every headline metric includes a protocol or guardrail
[ ] Simulator/local_runtime/runtime wording is correct
[ ] Every headline claim can be traced to a concrete artifact
[ ] Paper review findings include affected_claim_id where applicable
[ ] Figures include units and readable legends
[ ] Figure captions describe evidence boundary
[ ] README/docs first screen explains what this is
[ ] README/docs first screen explains how to use it
[ ] README/docs first screen explains artifact outputs
[ ] README/docs first screen explains scope boundary

[Recommended]
[ ] Abstract only uses high-confidence claims
[ ] Result paragraphs can be mapped back to claim_id entries
[ ] Figure titles and captions use consistent naming
[ ] Release page links directly to paper/review artifacts when they exist
[ ] Limitations section explicitly names missing validations or replications
```

Verdict mapping:

- `HOLD`
  - any required item fails in a way that breaks claim safety
  - simulator/proxy evidence is presented as runtime evidence
  - a headline metric lacks baseline, protocol/guardrail, or source artifact
- `CONDITIONAL_GO`
  - all required items pass
  - one or more recommended items fail, or unresolved `P1` issues remain
- `GO`
  - all required items pass
  - no unresolved `P1` issue weakens a headline claim
