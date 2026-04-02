---
name: baseline-runner
description: "Use this when the project needs real baseline results before or alongside the main model. Runs classical or literature-aligned baselines under the same protocol and writes a reproducible baseline summary."
metadata:
  {
    "openclaw":
      {
        "emoji": "📏",
        "requires": { "bins": ["python3", "uv"] },
      },
  }
---

# Baseline Runner

**Don't ask permission. Just do it.**

Use this skill when the project needs trustworthy baseline numbers instead of only evaluating the proposed model in isolation.

Outputs go to the workspace root.

## Use This When

- `plan_res.md` already names baselines
- `project/` already exists or a baseline implementation path is known
- the experiment stage needs matched comparison numbers

## Do Not Use This When

- the project has not finished survey or planning
- no baseline method has been identified yet

## Required Inputs

- `plan_res.md`
- `survey_res.md`
- `project/` when the current project already has runnable code

If `plan_res.md` is missing, stop and say: `Run /research-plan first to complete the implementation plan.`

## Required Outputs

- `baseline_res.md`
- `experiments/baselines/` when runnable artifacts are created

## Workflow

### Step 1: Read the Evaluation Contract

Read:

- `plan_res.md`
- `survey_res.md`
- current `experiment_res.md` if it exists

Extract:

- baseline names
- evaluation metric
- protocol or guardrail
- dataset or workload assumptions

### Step 2: Define the Baseline Matrix

Create a small comparison matrix with:

- baseline name
- source or basis
- expected setup
- metric
- status: `ready`, `needs adaptation`, or `missing`

Use `references/baseline-matrix-template.md`.

### Step 3: Run or Approximate Baselines Conservatively

For each baseline:

- if code is runnable under the current workspace, run it
- if only a lightweight adaptation is needed, implement the minimal adapter
- if a baseline cannot be run honestly, mark it as unavailable instead of inventing numbers

All numeric results must come from actual execution logs or explicit imported evidence.

### Step 4: Write `baseline_res.md`

Use `references/baseline-report-template.md`.

The report must include:

- which baselines were attempted
- which ones ran successfully
- the exact metric values
- the evaluation protocol
- missing or partial baselines
- the most comparable baseline for the current project

## Rules

1. Never fabricate baseline numbers.
2. Keep the protocol aligned with the main experiment whenever possible.
3. If a baseline is only partly comparable, say so explicitly.
4. Prefer 2-3 strong baselines over a long weak list.
