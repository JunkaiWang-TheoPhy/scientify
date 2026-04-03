# Paragraph Examples

Use these as movable writing patterns, not as a fixed chapter-by-chapter script.

The same pattern can appear in different places depending on the paper shape:

- a framing paragraph can appear in `Introduction`, `Problem Setup`, or the opening of a short report
- a quantified claim paragraph can appear in `Main Results`, an artifact summary, or a rebuttal appendix
- a boundary paragraph can appear in `Main Results`, `Discussion / Scope Note`, `Conclusion`, or `paper/boundary_notes.md`

## Pattern 1: Framing the Problem

### Bad

Inference optimization has become very important in many domains. Many prior methods have tried to solve this problem. Our method is better and more comprehensive than existing approaches.

Problems:

- generic setup
- no specific gap
- unsupported comparative claim

### Better

Fixed-budget inference systems often face a hard tradeoff between latency and quality. Existing baselines expose this tradeoff, but they do not make it easy to preserve quality under the same resource envelope. This work targets that gap and focuses on artifact-backed tradeoff improvement rather than unconstrained speedup claims.

Why this is better:

- defines the problem concretely
- names the gap
- avoids unsupported boasting

## Pattern 2: Quantified Claim

### Bad

KV2 shows strong and promising gains across the board. The method appears robust and significantly better than prior approaches. These results suggest the design is highly effective.

Problems:

- no number
- no baseline
- no evidence boundary
- interpretation blended into the result claim

### Better

KV2 improves mean TTFT by 17.53% versus INT4-FIFO under the stated simulator protocol. The comparison is measured under `quality_penalty_mean <= 0.02` and is anchored in `claim-001`. This result supports a lower-latency tradeoff within simulator evaluation, but it does not yet establish full runtime behavior.

Why this is better:

- includes a metric
- names the baseline
- points to a claim anchor
- states the evidence boundary

## Pattern 3: Figure-Led Result

### Bad

Figure 2 shows the main result.

Problems:

- no takeaway
- no metric
- no explanation of why the figure matters

### Better

Figure 2 summarizes the latency-quality tradeoff and shows that KV2 reduces mean TTFT relative to INT4-FIFO under the stated simulator guardrail. This figure supports `claim-001` and should be read as simulator evidence rather than runtime validation.

Why this is better:

- states the takeaway
- names the comparison target
- marks the evidence boundary

## Pattern 4: Comparison Paragraph

### Bad

Our method outperforms the baseline in most cases and is generally better than previous approaches.

Problems:

- does not say which baseline
- does not say what metric improved
- hides regime differences behind “most cases”

### Better

Relative to INT4-FIFO, KV2 improves mean TTFT while preserving the stated quality guard, but it does not exceed KVQuant-3bit-1% on bytes/request under the same harness. This makes the current result a balanced tradeoff claim rather than a blanket “best overall” claim.

Why this is better:

- names both comparison targets
- distinguishes the winning dimension from the losing one
- prevents overclaim

## Pattern 5: Interpretation Paragraph

### Bad

These results prove that KV2 is generally superior and will likely work well across all realistic deployments.

Problems:

- turns a bounded observation into a general claim
- mixes evidence and speculation
- overgeneralizes scope

### Better

The measured simulator results indicate a lower-latency tradeoff under the reported protocol. One plausible interpretation is that the KV2 design better preserves quality under a fixed budget, but that interpretation still requires runtime validation and broader workload coverage.

Why this is better:

- starts from the observed result
- labels interpretation as interpretation
- keeps the open validation gap visible

## Pattern 6: Boundary Paragraph

### Bad

There are some limitations and future work remains.

Problems:

- vague
- hides the real evidence boundary
- says nothing actionable

### Better

The current artifact does not establish full runtime behavior because the headline comparisons are still simulator-backed. Runtime smoke tests, broader workloads, and missing baseline replications remain open, so the paper intentionally avoids stronger deployment claims.

Why this is better:

- names the missing validation
- states what is not claimed
- ties the boundary to the actual artifact

## Pattern 7: Closing Sentence

### Bad

Overall, our method is a highly robust and comprehensive solution for efficient inference.

Problems:

- empty praise
- no measurable support
- overgeneralized scope

### Better

Overall, the current artifact supports lower-latency tradeoffs under the reported simulator protocol, while runtime validation and broader workload coverage remain open.

Why this is better:

- closes on the strongest supported claim
- keeps the scope visible
- avoids turning the conclusion into a slogan

## How To Use These Examples

- Pick the pattern that matches the paragraph's job, not the section name.
- If one paragraph is trying to do two jobs, split it.
- Prefer adapting a pattern to the current evidence base over copying its sentence order exactly.
