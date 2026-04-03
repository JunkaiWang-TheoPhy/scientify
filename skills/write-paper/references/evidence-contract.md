# Evidence Contract

Every headline claim should be recorded using this structure before drafting prose:

```yaml
- claim_id: "claim-001"
  claim_text: "KV2 achieves 17.53% mean TTFT gain vs INT4-FIFO under the stated simulator protocol."
  claim_type: "result"
  source_files:
    - "Comparision-KV2/results/kv2_compare_quant_family_local_20260329.json"
    - "experiment_res.md"
  figure_or_table_anchor: "fig-kv2-tradeoff-overview"
  baseline: "INT4-FIFO"
  evidence_type: "simulator"
  protocol_or_guardrail: "quality_penalty_mean <= 0.02"
  confidence: "high"
  allowed_in_sections:
    - "abstract"
    - "results"
    - "discussion"
    - "conclusion"
    - "boundary_note"
```

Required fields:

- `claim_id`
- `claim_text`
- `claim_type`
- `source_files`
- `figure_or_table_anchor`
- `baseline`
- `evidence_type`
- `protocol_or_guardrail`
- `confidence`
- `allowed_in_sections`

Field notes:

- `claim_id` must be stable within the draft and reused by review findings.
- `claim_type` must be one of `result`, `observation`, or `interpretation`.
- `source_files` should list every artifact needed to verify the claim.
- `figure_or_table_anchor` should point to the figure/table label used in the draft or manifest.
- `confidence` should be `high`, `medium`, or `low`.
- `allowed_in_sections` defines where the claim may appear in prose. Do not place the claim outside this list.

Allowed `evidence_type` values:

- `simulator`
- `local_runtime`
- `runtime`

Minimum writing gate:

- Do not draft a headline result if `baseline`, `protocol_or_guardrail`, or `source_files` is missing.
- Do not place a claim in `abstract` unless `confidence` is `high`.
- Do not write simulator-only evidence as runtime validation.
