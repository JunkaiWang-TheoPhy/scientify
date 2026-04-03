# Figure Callout Template

Use this guide when writing the first prose mention of a figure.

The callout sentence should do three jobs:

1. name the figure
2. state the concrete takeaway
3. name the comparison target or evaluation frame when that is central to the claim

Preferred structure:

```text
Figure \ref{{latex_label}} shows {takeaway_sentence} under {protocol or evaluation frame}.
```

Examples:

```text
Figure \ref{fig:kv2-tradeoff-overview} shows that KV2 improves TTFT relative to INT4-FIFO under the shared simulator protocol.
```

```text
Figure \ref{fig:runtime-smoke} shows that the local runtime smoke test preserves the winner ordering observed in the simulator summary.
```

Avoid callouts that only announce the figure:

```text
Figure 3 shows the results.
```

Good callouts should:

- appear before the figure block or at the first discussion point
- contain the main takeaway, not just a pointer
- stay consistent with `caption_long`
- avoid introducing a stronger claim than the figure actually supports
