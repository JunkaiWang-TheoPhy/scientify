# Evidence Contract

Every headline claim should be recorded using this structure before drafting prose:

```yaml
- claim_id: "claim-001"
  claim: "KV2 achieves 17.53% mean TTFT gain vs INT4-FIFO"
  baseline: "INT4-FIFO"
  evidence_type: "simulator"
  source_file: "Comparision-KV2/results/kv2_compare_quant_family_local_20260329.json"
  figure_or_table: "Comparision-KV2/reports/figures/kv2_tradeoff_overview_20260329.png"
  protocol: "quality_penalty_mean <= 0.02"
  status: "active"
```

Required fields:

- `claim`
- `baseline`
- `evidence_type`
- `source_file`
- `figure_or_table`
- `protocol`

Allowed `evidence_type` values:

- `simulator`
- `local_runtime`
- `full_runtime`
