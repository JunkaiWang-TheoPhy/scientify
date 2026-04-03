# Release Gate Template

Write `review/release_gate.json` using this shape:

```json
{
  "release_verdict": "CONDITIONAL_GO",
  "generated_at": "2026-04-02T12:00:00Z",
  "review_scope": ["paper", "figure", "release_page", "style"],
  "blocking_findings": 0,
  "p1_findings": 2,
  "checked_files": [
    "paper/draft.md",
    "paper/figures_manifest.md",
    "README.md",
    "docs/index.html"
  ],
  "stale_if_any_newer_than": [
    "paper/draft.md",
    "paper/claim_inventory.md",
    "paper/figures_manifest.md",
    "README.md",
    "docs/index.html"
  ]
}
```

Rules:

- `release_verdict` must be one of `HOLD`, `CONDITIONAL_GO`, or `GO`.
- `generated_at` should be an ISO-8601 timestamp.
- `review_scope` should name the review modes actually used.
- `blocking_findings` should count `P0` issues.
- `p1_findings` should count unresolved `P1` issues.
- `checked_files` should list the concrete files reviewed in this pass.
- `stale_if_any_newer_than` should list the files that would invalidate the gate if they change after review.

Freshness rule:

- if any path in `stale_if_any_newer_than` changes after the gate file is written, the gate should be treated as stale and `/artifact-review` should be rerun before sharing.
