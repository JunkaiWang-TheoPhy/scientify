---
name: figure-standardize
description: "Use this when the user wants to improve chart quality, standardize plotting style, regenerate release figures, or add captions/protocol notes. Normalizes fonts, colors, legends, units, and scope notes across Scientify figures."
metadata:
  {
    "openclaw":
      {
        "emoji": "📊",
      },
  }
---

# Figure Standardization

**Don't ask permission. Just do it.**

Use this skill to turn one-off Scientify charts into release-ready figures.

**Do not run new experiments here.** Work from existing results, plotting scripts, and figure bundles. If the source data is missing or inconsistent, report that explicitly instead of smoothing it over.

## Required Outputs

1. Updated plotting script(s) or a shared style helper
2. Regenerated `.png` and `.pdf` files when the pipeline supports both
3. A figure spec file:
   - prefer `reports/figures/figure_spec.md`
   - otherwise `project/figures/figure_spec.md`

## Workflow

### Step 1: Inspect Inputs

Read:

- existing figures
- the generator script(s)
- the result tables / JSON / Markdown that feed the figures
- any surrounding README or release notes that explain the figure family

Prefer improving an existing generator over creating a second one-off script.

### Step 2: Standardize the Figure Family

Normalize the full family, not just one chart:

- font family and title hierarchy
- semantic color mapping
- axis labels and units
- legend order and naming
- decimal precision and tick formatting
- line widths / marker sizes
- caption structure
- protocol note wording

Use the palette and caption contract in `references/figure-style-guide.md` and `references/caption-template.md`.

### Step 3: Write the Figure Spec

Create or update `figure_spec.md` with one section per figure:

- figure filename
- source files
- metrics shown
- baseline or comparison family
- quality guard / evaluation constraint
- simulator/runtime note
- intended takeaway

### Step 4: Re-render and Verify

Re-render the figures after script updates.

Keep filenames stable unless the user explicitly asked for a new release bundle.

## Figure Rules

1. Keep metric semantics identical across a figure family.
2. Always show units explicitly.
3. If a result comes from simulator or proxy evaluation, state that in the caption or protocol note.
4. Do not hide failing or quality-guard-breaking baselines; mark them clearly.
5. Do not change the scientific claim. This skill improves packaging, not evidence.
