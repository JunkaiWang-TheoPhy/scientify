---
name: algorithm-selection
description: "Use this when the user needs to choose between multiple ML routes after survey but before committing to implementation. Compares candidate approaches, selects one, records rejected routes, and keeps a fallback."
metadata:
  {
    "openclaw":
      {
        "emoji": "🧭",
      },
  }
---

# Algorithm Selection

**Don't ask permission. Just do it.**

Use this skill after `/research-survey` when there are several plausible ML approaches and the project needs a deliberate route choice instead of jumping straight into implementation.

Outputs go to the workspace root.

## Use This When

- `survey_res.md` already exists
- there are at least 2 plausible methods or model families
- the user wants a chosen route plus backups

## Do Not Use This When

- the project has no survey yet
- the team already decided the model route and only needs implementation details

## Required Inputs

- `SOUL.md`
- `survey_res.md`
- `knowledge/paper_*.md` when available

If `survey_res.md` is missing, stop and say: `Run /research-survey first to complete the deep analysis.`

## Required Output

- `selection_res.md`

## Workflow

### Step 1: Read the Current Project Direction

Read:

- `SOUL.md`
- `survey_res.md`
- relevant `knowledge/paper_*.md`

Extract:

- the task and evaluation target
- method families mentioned in survey
- constraints such as compute, data, latency, interpretability, or deployment needs

### Step 2: Build 2-3 Candidate Routes

Create 2-3 realistic candidate routes only. For each route, record:

- route name
- core idea
- supporting papers
- expected strengths
- expected risks
- implementation cost
- baseline compatibility

Use `references/candidate-template.md`.

### Step 3: Select One Route and Keep Backups

Choose:

- one `Chosen Route`
- one or more `Rejected Routes`
- one `Fallback Route`

The fallback should be the route most likely to work if the chosen route underperforms or proves too expensive to implement.

### Step 4: Write `selection_res.md`

Use `references/selection-template.md`.

The final output must include:

- project goal
- decision criteria
- candidate options table
- chosen route
- rejected routes
- fallback route
- next recommended command

## Rules

1. Do not present only one route unless the survey truly leaves no meaningful alternative.
2. Every route must cite at least one paper or survey-derived basis.
3. The chosen route must match the project constraints in `SOUL.md`.
4. The fallback route must be different from the chosen route.
