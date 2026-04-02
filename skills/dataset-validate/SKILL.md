---
name: dataset-validate
description: "Use this when the project needs a dedicated data-quality review before model review. Checks data reality, split correctness, label health, leakage risk, shape consistency, and mock-data disclosure."
metadata:
  {
    "openclaw":
      {
        "emoji": "🗂️",
        "requires": { "bins": ["python3", "uv"] },
      },
  }
---

# Dataset Validate

**Don't ask permission. Just do it.**

Use this skill before or alongside model implementation review when data quality needs to be checked separately from model quality.

Outputs go to the workspace root.

## Use This When

- `plan_res.md` already exists
- the project is about to implement or has just implemented a model
- data quality, split quality, or label integrity is still uncertain

## Do Not Use This When

- the project has no concrete plan yet
- there is no dataset or data-loading path to inspect

## Required Inputs

- `plan_res.md`
- `project/` if a data pipeline already exists
- `survey_res.md` when it defines dataset or protocol expectations

If `plan_res.md` is missing, stop and say: `需要先运行 /research-plan 完成实现计划`.

## Required Output

- `data_validation.md`

## Workflow

### Step 1: Read the Data Contract

Read:

- `plan_res.md`
- `survey_res.md` if present
- current data-loading code under `project/data/` if present

Extract:

- expected dataset name
- source
- split structure
- label or target format
- expected shapes

### Step 2: Audit Data Reality

Check:

- whether dataset files actually exist
- whether the data is real or mock
- whether mock usage is clearly declared
- whether row count / sample count is plausible

### Step 3: Audit Data Integrity

Check:

- train / val / test split existence and separation
- label distribution or target sanity
- shape / dtype consistency
- obvious leakage risks
- preprocessing consistency with `plan_res.md`

If code exists, run lightweight inspection commands under the project environment to verify counts and sample structure.

### Step 4: Write `data_validation.md`

Use `references/data-validation-template.md`.

The report must include:

- dataset identity
- data reality check
- split integrity
- label / target health
- leakage risk
- mock-data disclosure
- verdict: `PASS`, `NEEDS_REVISION`, or `BLOCKED`
- exact next step

## Rules

1. Keep data quality separate from model quality.
2. Never infer that data is real if the files or loading path are missing.
3. If mock data is used, call it out explicitly.
4. If data leakage is plausible, treat it as blocking until clarified.
