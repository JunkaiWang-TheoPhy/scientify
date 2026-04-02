# Paper Draft

This is a modular paper template, not a fixed universal outline.

Core sections should usually stay:

- Abstract
- Introduction
- Problem Setup
- Method / System
- Experimental Protocol
- Main Results
- Conclusion

Optional modules should be added only when they help the current paper:

- Related Work
- Ablations and Additional Analysis
- Discussion / Scope Note
- Boundary / Scope surface

Choose the paper shape before filling the outline:

- `result_note`
  - use the core sections only
- `systems_full`
  - enable optional modules only when they carry real argumentative load
- `artifact_summary`
  - keep the shape lean and boundary-aware
- `workshop_short`
  - compress setup and method, and avoid optional modules unless required

## Abstract

Use exactly four functional sentence types in this order:

1. problem statement
2. method or system statement
3. strongest quantitative result
4. scope boundary or evidence boundary

Do not use unsupported adjectives such as "strong", "significant", or "robust" without a metric.
Keep the abstract to four sentences in the default profile.

## 1. Introduction

Paragraph 1:
- define the problem and why it matters

Paragraph 2:
- explain the gap in prior methods or current workflow

Paragraph 3:
- summarize contributions without introducing unsupported result claims

Every claimed contribution here must map to a later section.
Keep the default introduction to three compact paragraphs.

## Optional: Related Work

If a related-work section is needed, keep it focused on:

- closest comparison family
- direct difference in target, assumptions, or evidence type
- what is compared directly versus what is only contextualized

Do not turn related work into a generic survey dump.

## 2. Problem Setup

Define task scope, assumptions, notation, evaluation target, and any constraints needed to interpret the paper.
Keep this section definition-heavy and result-light.

## 3. Method / System

Describe the system or method design.

Separate:
- what is implemented
- what is claimed as a contribution
- what is only an engineering choice

Prefer short subsections or short paragraphs over one long implementation block.

## 4. Experimental Protocol

State:

- baseline family
- evaluation setup
- quality guard or protocol constraint
- evidence boundary (`simulator`, `local_runtime`, or `runtime`)

State the evaluation regime before making any performance claim.

## 5. Main Results

Every paragraph in this section must:

- map back to at least one `claim_id`
- contain at least one quantitative statement
- name a baseline or comparison target
- state a takeaway, not just restate a figure

Recommended paragraph structure:

1. claim sentence
2. evidence sentence
3. comparison sentence
4. boundary or caveat sentence

Figure/text rules:

- Introduce each figure with a callout sentence before or at first discussion.
- A figure callout must contain a takeaway, not just "Figure X shows ..."
- If a figure supports a headline claim, the text should also name the relevant `claim_id` or clearly map to it.
- Prefer shorter result paragraphs with one main claim each.

## 6. Ablations and Additional Analysis

Keep secondary analysis separate from headline results.

Do not let ablations silently carry the main claim.
Use this section to explain or stress-test the main result, not to replace it.

## Optional: Discussion / Scope Note

Use this module when the paper needs an explicit place to:

- separate observation from interpretation
- state evidence boundary
- mark what is intentionally not claimed
- explain where the current artifact does not generalize

This can be a short section, a subsection, or a structured paragraph block.

## Optional: Boundary / Scope Surface

Do not force a dedicated limitations section by default.

Pick the lightest surface that fits the current paper:

- one short caveat paragraph in `Main Results`
- one short scope paragraph in `Conclusion`
- an optional `Discussion / Scope Note`
- a standalone `paper/boundary_notes.md` during drafting

Use a dedicated limitations section only if the venue or review process explicitly expects one.

## 7. Conclusion

Restate only the strongest supported claims.

Do not introduce a new claim, baseline, or interpretation here.
Keep the conclusion to 1-2 tight paragraphs in the default profile.
