---
name: write-paper
description: "Use this when the user wants a systems paper, experiment paper, technical report, or extended abstract drafted from existing Scientify artifacts. Builds a claim-bounded paper draft from experiment outputs, figures, and supporting notes."
metadata:
  {
    "openclaw":
      {
        "emoji": "📄",
      },
  }
---

# Paper Writing

**Don't ask permission. Just do it.**

Use this skill for experiment-driven or systems-style papers.

**Do not use this for pure survey writing.** For literature reviews or thesis review chapters, use `/write-review-paper` instead.

Outputs go to `paper/`.

## Prerequisites

You need a real evidence base from existing artifacts, ideally:

- `experiment_res.md`
- one or more figure files
- one or more comparison tables / result summaries
- optional support from `survey_res.md`, `plan_res.md`, `ml_res.md`

If the evidence base is too thin, write the draft conservatively and mark unsupported sections as `TODO`.

## Required Outputs

- `paper/claim_inventory.md`
- `paper/figures_manifest.md`
- `paper/draft.md`
- `paper/limitations.md`

## Workflow

### Step 1: Build the Claim Inventory

Before drafting prose, create `claim_inventory.md`.

For each claim, record:

- claim text
- source file(s)
- figure or table anchor
- baseline / comparison target
- protocol or guardrail
- simulator/runtime status

Use `references/evidence-contract.md`.

### Step 2: Build the Figures Manifest

Create `figures_manifest.md` with:

- filename
- what it supports
- where it should appear in the paper
- caption status
- whether the figure is simulator/proxy or runtime evidence

### Step 3: Draft the Paper

Write `draft.md` using `references/paper-template.md`.

Every result paragraph must stay within the claim inventory. If the evidence only supports a narrower claim, write the narrower claim.

### Step 4: Write Limitations Explicitly

Write `limitations.md` covering:

- simulator vs runtime boundary
- internal vs external baseline limits
- missing replications
- coverage gaps

## Writing Rules

1. No headline metric without baseline + protocol + source path.
2. No simulator-only result should be phrased as runtime validation.
3. Distinguish observed result from interpretation.
4. Keep unsupported ideas in a clearly marked future-work section, not in the main results.
