# Figure Style Guide

Use one consistent style across a figure family:

- one font family
- one semantic color per method family
- one stable baseline line style
- explicit units in axis labels
- compact legend names
- protocol note under the figure or in the caption
- one stable caption and callout structure across the family

Required paper-facing figure contract fields:

- `caption_short`
- `caption_long`
- `callout_sentence`
- `placement_hint`
- `supports_claim_ids`

Required caption fields:

- what is compared
- which baseline is used
- what metric is shown
- what evidence type supports the figure
- what protocol or guardrail defines the evaluation regime when that matters for the claim

Paper-facing figures should stay aligned across four surfaces:

1. `paper/figures_manifest.md`
2. the first prose callout
3. the figure caption
4. the eventual LaTeX figure block

Do not let these four surfaces drift apart.
