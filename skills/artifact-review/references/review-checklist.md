# Release Checklist

```text
[Required]
[ ] Every headline metric includes a baseline
[ ] Every headline metric includes a source artifact path
[ ] Every headline metric includes a protocol or guardrail
[ ] Simulator/local_runtime/runtime wording is correct
[ ] Every headline claim can be traced to a concrete artifact
[ ] Every headline claim has a figure, table, or explicit text-only justification
[ ] review/release_gate.json exists and matches the current verdict
[ ] Paper review findings include affected_claim_id where applicable
[ ] Figures include units and readable legends
[ ] Every paper-facing figure has supports_claim_ids in paper/figures_manifest.md
[ ] Every paper-facing figure has a callout_sentence before or at first use
[ ] Figure placement is aligned with the claim order in the text
[ ] Figure captions describe evidence boundary
[ ] Figure captions include baseline, metric, evidence type, and protocol when relevant
[ ] README/docs first screen explains what this is
[ ] README/docs first screen explains how to use it
[ ] README/docs first screen explains artifact outputs
[ ] README/docs first screen explains scope boundary

[Recommended]
[ ] Abstract only uses high-confidence claims
[ ] Result paragraphs can be mapped back to claim_id entries
[ ] Figure callouts, captions, and figure blocks are consistent with paper/figures_manifest.md
[ ] review/release_gate.json lists the files that would make the gate stale if changed later
[ ] Figure titles and captions use consistent naming
[ ] Release page links directly to paper/review artifacts when they exist
[ ] Evidence boundaries and missing validations are stated somewhere explicit, even if there is no dedicated limitations section
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
