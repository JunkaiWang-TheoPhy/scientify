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

Each claim entry must use the same fixed fields:

- `claim_id`
- `claim_text`
- `claim_type` (`result`, `observation`, or `interpretation`)
- `source_files`
- `figure_or_table_anchor`
- `baseline`
- `protocol_or_guardrail`
- `evidence_type` (`simulator`, `local_runtime`, or `runtime`)
- `confidence` (`high`, `medium`, or `low`)
- `allowed_in_sections` (`abstract`, `intro`, `results`, `discussion`, `limitations`)

Use `references/evidence-contract.md` and `references/claim-inventory-template.md`.

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

Use this section contract while drafting:

- `Abstract` may only use claims with `confidence=high`.
- `Introduction` may use problem framing and setup claims, but must not introduce new result claims.
- `Results` must anchor each substantive paragraph to at least one `claim_id`.
- `Discussion` may interpret results, but interpretation must remain explicitly separated from observed outcomes.
- `Limitations` must explicitly cover evidence boundaries, missing validations, and unsupported comparisons.
- `Future Work` is the only place where unsupported but plausible ideas may appear.

### Stop Conditions

Do not continue into a full results draft if any of the following is true:

- `experiment_res.md` is missing and no equivalent result artifact exists.
- No figure or table anchor exists for a headline result.
- A claimed improvement has no explicit baseline.
- A result claim has no source file or no protocol / guardrail.

If one of these conditions is triggered, stop after writing `claim_inventory.md` and `limitations.md`, and mark the blocked sections in `draft.md` as `TODO`.

### Step 4: Write Limitations Explicitly

Write `limitations.md` covering:

- simulator vs runtime boundary
- internal vs external baseline limits
- missing replications
- coverage gaps

Use `references/limitations-template.md`.

## Writing Rules

1. No headline metric without baseline + protocol + source path.
2. No simulator-only result should be phrased as runtime validation.
3. Distinguish observed result from interpretation.
4. Keep unsupported ideas in a clearly marked future-work section, not in the main results.
5. Do not place a claim in a section that is not listed in its `allowed_in_sections`.
