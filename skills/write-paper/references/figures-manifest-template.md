# Figures Manifest Template

Use this structure for `paper/figures_manifest.md`.

This file is the single source of truth for how a figure supports claims, how it is introduced in prose, and how it should be rendered in LaTeX.

```yaml
- figure_id: "fig-kv2-tradeoff-overview"
  file_path: "paper/figures/kv2_tradeoff_overview.pdf"
  latex_label: "fig:kv2-tradeoff-overview"
  section: "main_results"
  placement_hint: "figure[t]"
  caption_short: "KV2 versus INT4-FIFO and quant-family baselines under the simulator protocol."
  caption_long: "KV2 improves TTFT relative to INT4-FIFO while preserving the stated quality guard. The figure compares the main tradeoff surface across the selected quant-family baselines under the shared simulator protocol."
  takeaway_sentence: "KV2 improves TTFT relative to INT4-FIFO, but the strongest bytes-efficiency challenger remains KVQuant-3bit-1% under the same harness."
  callout_sentence: "Figure \\ref{fig:kv2-tradeoff-overview} compares KV2 with INT4-FIFO and quant-family baselines under the shared simulator protocol."
  baseline: "INT4-FIFO"
  evidence_type: "simulator"
  source_metrics:
    - "mean_ttft_gain_vs_int4_pct"
    - "mean_bytes_gain_vs_int4_pct"
  source_files:
    - "experiment_res.md"
    - "Comparision-KV2/results/kv2_compare_quant_family_local_20260329.md"
  supports_claim_ids:
    - "claim-001"
    - "claim-003"
  must_appear_before_claim_ids:
    - "claim-001"
```

Rules:

- Use one entry per figure, not one entry per paragraph.
- `section` should name the manuscript module that owns the figure, such as `main_results`, `experimental_protocol`, or `ablations`.
- `placement_hint` must already be TeX-oriented, for example `figure[t]`, `figure[b]`, `figure* [t]`, or `inline_reference_only`.
- `caption_short` is for the optional short caption in `\caption[...]`.
- `caption_long` must include the scientific meaning, the comparison target, and the relevant scope or protocol note when needed.
- `takeaway_sentence` is the one-sentence interpretation the prose should not forget to make explicit.
- `callout_sentence` is the first sentence that should introduce the figure in the body text.
- `supports_claim_ids` lists which claims the figure directly supports.
- `must_appear_before_claim_ids` lists the claims that should not appear before the reader has seen or been introduced to this figure.

If a headline claim is table-only or text-only evidence, do not create a fake figure entry. Instead, say so explicitly in the results paragraph and keep the claim anchored to a table or source artifact.
