# Style Banlist

This is not a universal forbidden-word list.

Use it as a risk map: the higher the claim pressure, the more these words need explicit support nearby.

## High-Risk Praise Words

These often create fake confidence when they are not tied to evidence in the same sentence or the next sentence:

- `significant`
- `substantial`
- `strong`
- `robust`
- `effective`
- `promising`
- `remarkable`
- `novel`
- `comprehensive`
- `state-of-the-art`

## High-Risk Hedge Words

These are useful for interpretation, but risky when they blur what is actually observed:

- `may`
- `can`
- `could`
- `potentially`
- `suggests`
- `appears to`
- `likely`
- `in general`
- `overall`

## Vague Result Phrases

These usually need to be rewritten into metric- or evidence-based language:

- `shows advantages`
- `performs well`
- `works effectively`
- `achieves competitive results`
- `delivers better performance`
- `improves overall quality`
- `demonstrates robustness`
- `has broad applicability`

## Rewrite Moves

When a sentence sounds too soft, too grand, or too vague, prefer one of these moves:

- add a metric
- add a baseline
- add a protocol or guardrail
- add a source anchor such as `claim_id`, figure, or table
- add a scope or evidence boundary
- split observation from interpretation

Examples:

- `strong improvement` -> `17.53% mean TTFT gain vs INT4-FIFO`
- `robust behavior` -> `maintains quality_penalty_mean <= 0.02 under the stated protocol`
- `promising result` -> `improves bytes/request under simulator evaluation, but lacks runtime validation`

## Usage Rules

- If one of the high-risk praise words appears in a result sentence, the same sentence or the next sentence should also contain a metric, baseline, or explicit evidence anchor.
- Hedge words are acceptable when they clearly mark interpretation, uncertainty, or future-facing reasoning.
- Do not use hedge words to hide whether a result is actually observed or merely inferred.
- If a sentence can be made more precise by adding a number, comparison target, or boundary, do that instead of adding emphasis.

## Surface-Aware Notes

Different writing surfaces tolerate different kinds of language:

- high-pressure surfaces such as abstracts, headline result sentences, captions, and opening-page summaries need the strictest wording
- medium-pressure surfaces such as result discussion and comparison paragraphs can carry some interpretation, but still need explicit evidence anchors
- lower-pressure surfaces such as discussion, scope notes, and future-work paragraphs can use more hedging, as long as they do not rewrite observed results into broader claims

The key question is not “what section am I in?” but “how much claim pressure does this sentence carry?”
