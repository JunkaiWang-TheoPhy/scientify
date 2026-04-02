# Claim Inventory Template

Use this structure for `paper/claim_inventory.md` before drafting any prose:

```yaml
- claim_id: "claim-001"
  claim_text: "KV2 achieves 17.53% mean TTFT gain vs INT4-FIFO under the stated simulator protocol."
  claim_type: "result"
  source_files:
    - "experiment_res.md"
    - "Comparision-KV2/results/kv2_compare_quant_family_local_20260329.json"
  figure_or_table_anchor: "fig-kv2-tradeoff-overview"
  baseline: "INT4-FIFO"
  protocol_or_guardrail: "quality_penalty_mean <= 0.02"
  evidence_type: "simulator"
  confidence: "high"
  allowed_in_sections:
    - "abstract"
    - "results"
    - "limitations"
```

Authoring notes:

- Use one claim entry per independently reviewable statement.
- Use `claim_type=result` for measured outcomes.
- Use `claim_type=observation` for descriptive trends that stop short of causal interpretation.
- Use `claim_type=interpretation` for explanation or hypothesis, and keep these out of `abstract` unless independently supported.
- `allowed_in_sections` is a hard constraint, not a suggestion.
- If a field is unknown, stop and resolve the evidence gap instead of drafting around it.
