# Limitations Template

Use this structure for `paper/limitations.md`:

```md
# Limitations

## Evidence Boundary
- State whether the main evidence is simulator, local runtime, or runtime.
- Name the strongest claim that is supported today.
- Name one claim that is intentionally not made because the evidence is not strong enough.

## Baseline and Comparison Limits
- List any missing baselines or incomplete comparison targets.
- Note whether comparisons are internal-only, partial, or not yet replicated.

## Validation Gaps
- List missing runtime checks, ablations, or repeated trials.
- State whether any figure/table is still provisional.

## External Validity
- Explain what workloads, settings, or tasks are not covered.
- Call out where the current artifact may not generalize.

## Next Validation Steps
- List the smallest follow-up experiments needed to strengthen the main claims.
```

Writing rules:

- Limitations must be concrete and artifact-specific.
- Do not hide major evidence gaps in future work.
- If a headline claim depends on simulator evidence, say so explicitly here.
