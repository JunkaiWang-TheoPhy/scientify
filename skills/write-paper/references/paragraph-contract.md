# Paragraph Contract

Use these rules when drafting sections for `paper/draft.md` or `paper/sections/*.tex`.

## Global Rules

- Prefer short paragraphs with one clear function over long mixed-purpose paragraphs.
- Every paragraph should have a dominant job: setup, claim, evidence, comparison, interpretation, or boundary note.
- If a paragraph mixes observation and interpretation, split it.
- If a paragraph makes a comparison, it must name the baseline or comparison target explicitly.
- If a paragraph cannot be tied to a source artifact, do not present it as a result paragraph.

## Abstract

- Sentence 1: define the problem.
- Sentence 2: state the method, system, or intervention.
- Sentence 3: state the strongest supported quantitative result.
- Sentence 4: state the scope boundary or evidence boundary.

Rules:

- Use only `confidence=high` claims here.
- Do not use praise words unless a number and baseline follow in the same sentence.
- Keep the abstract to exactly four sentences in the default template.

## Introduction

- Paragraph 1: problem and motivation
- Paragraph 2: gap or limitation in current approaches
- Paragraph 3: contribution summary

Rules:

- Do not preview unsupported result claims.
- Contributions must map to later sections.
- Keep the default introduction to three short paragraphs unless the venue profile says otherwise.

## Problem Setup

- Paragraph 1: define the task, setting, or operational problem.
- Paragraph 2: define evaluation target, constraints, and success criteria.

Rules:

- Prefer definitions and scope boundaries over motivation language.
- Do not smuggle results into the setup section.

## Method / System

- Paragraph 1: core design idea
- Paragraph 2: implementation structure
- Paragraph 3: what is claimed as the contribution versus what is only an engineering choice

Rules:

- Separate contribution-bearing design from ordinary implementation detail.
- If a design choice is not defended later, avoid overselling it here.

## Experimental Protocol

- Paragraph 1: baselines and comparison family
- Paragraph 2: workloads, data, or evaluation setting
- Paragraph 3: quality guardrails and evidence boundary

Rules:

- Always state the evaluation regime before summarizing the result.
- Make simulator, local-runtime, and runtime scopes explicit.

## Main Results

Each paragraph must contain:

1. a claim sentence
2. an evidence sentence
3. a baseline comparison sentence
4. a boundary or caveat sentence

Rules:

- Every paragraph must map to at least one `claim_id`.
- Every paragraph must include at least one quantitative statement.
- If the paragraph compares methods, it must name the baseline explicitly.
- Each figure should be introduced by a callout sentence before or at first discussion.
- A result paragraph should usually be 4-6 sentences, not a long narrative block.

## Ablations and Additional Analysis

- Paragraph 1: what secondary question is being tested
- Paragraph 2+: measured answer with comparison and takeaway

Rules:

- Keep ablations secondary. Do not let them silently carry the paper's main claim.
- If an ablation becomes central to the story, move the corresponding claim into `Main Results`.

## Discussion

- Start from an observed result.
- Then add interpretation.

Rules:

- Keep observation and interpretation separable.
- Do not hide speculation inside result phrasing.

## Related Work

- Paragraph 1: closest comparison family
- Paragraph 2: key difference in assumption, target, or evidence
- Paragraph 3: what is compared directly versus what is only contextualized

Rules:

- Do not turn related work into a survey dump.
- Compare on dimensions that matter for this paper: target, evidence type, baseline family, and scope.

## Boundary / Scope Surface

- State the evidence boundary.
- State what is missing.
- State what is intentionally not claimed.

Rules:

- Put this material in the lightest surface that fits the current paper: `Main Results`, `Discussion / Scope Note`, `Conclusion`, or `paper/boundary_notes.md`.
- Name the missing validation directly.
- If a claim depends on simulator evidence, say so explicitly.

## Conclusion

- Restate the strongest supported claims only.

Rules:

- No new claim.
- No new baseline comparison.
- No new interpretation that did not appear earlier.
- Prefer 1-2 tight paragraphs over a long recap.
