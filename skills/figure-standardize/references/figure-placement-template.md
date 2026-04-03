# Figure Placement Template

Use this guide when assigning `section` and `placement_hint` in `paper/figures_manifest.md`.

Recommended fields:

```yaml
section: "main_results"
placement_hint: "figure[t]"
must_appear_before_claim_ids:
  - "claim-001"
```

Placement hint options:

- `figure[t]`
  - standard single-column top placement
- `figure[b]`
  - standard single-column bottom placement
- `figure* [t]`
  - wide figure for two-column layouts
- `inline_reference_only`
  - no figure block in the current section; the text only points to a figure placed elsewhere

Placement rules:

- Put the figure in the same section that carries its main supported claim whenever possible.
- If a figure supports a headline result, the first callout should appear before or immediately adjacent to the corresponding claim.
- Do not place a figure so late that the reader sees the claim well before the figure is introduced.
- Use `must_appear_before_claim_ids` to mark claims that should not appear before the figure callout.
