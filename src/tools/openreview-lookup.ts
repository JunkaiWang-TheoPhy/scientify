import { Type } from "@sinclair/typebox";
import { Result } from "./result.js";

const OPENREVIEW_API_BASE = "https://api2.openreview.net";
const OPENREVIEW_WEB_BASE = "https://openreview.net";
const DEFAULT_MAX_RESULTS = 3;
const MAX_RESULTS_LIMIT = 10;
const DEFAULT_REVIEW_LIMIT = 3;
const MAX_REVIEW_LIMIT = 10;
const DEFAULT_FORUM_NOTES_LIMIT = 500;
const SEARCH_FANOUT = 4;
const SUMMARY_MAX_CHARS = 420;
const OPENREVIEW_TOKEN_ENV = "OPENREVIEW_API_TOKEN";

export const OpenReviewLookupSchema = Type.Object({
  query: Type.Optional(
    Type.String({
      description: "Paper title keywords for OpenReview search.",
    }),
  ),
  paper_id: Type.Optional(
    Type.String({
      description: "OpenReview note id (submission or note id).",
    }),
  ),
  forum_id: Type.Optional(
    Type.String({
      description: "OpenReview forum id.",
    }),
  ),
  external_id: Type.Optional(
    Type.String({
      description:
        "External paper id hint (for example arXiv id like 2603.05344 or a DOI). Used as search term when exact mapping is unavailable.",
    }),
  ),
  max_results: Type.Optional(
    Type.Number({
      description: "Maximum number of papers to return (1-10). Default: 3.",
      minimum: 1,
      maximum: MAX_RESULTS_LIMIT,
    }),
  ),
  include_reviews: Type.Optional(
    Type.Boolean({
      description: "Include review snippets and rating/confidence aggregates. Default: true.",
    }),
  ),
  review_limit: Type.Optional(
    Type.Number({
      description: "Maximum review snippets per paper (1-10). Default: 3.",
      minimum: 1,
      maximum: MAX_REVIEW_LIMIT,
    }),
  ),
});

type OpenReviewNote = {
  id: string;
  forum?: string;
  invitations?: string[];
  content?: Record<string, unknown>;
  mdate?: number;
  tcdate?: number;
  cdate?: number;
};

type OpenReviewNotesResponse = {
  notes?: OpenReviewNote[];
};

type ReviewSummary = {
  note_id: string;
  invitation: string;
  rating: number | null;
  confidence: number | null;
  summary: string;
};

type ForumLookupResult = {
  forum_id: string;
  paper_id: string;
  title: string | null;
  authors: string[];
  abstract_preview: string | null;
  pdf_url: string | null;
  venue: string | null;
  venue_id: string | null;
  decision: {
    value: string;
    note_id: string;
    invitation: string;
  } | null;
  review_stats: {
    total_reviews: number;
    rated_reviews: number;
    confidence_reviews: number;
    avg_rating: number | null;
    avg_confidence: number | null;
  };
  review_summaries: ReviewSummary[];
  links: {
    forum: string;
    note: string;
  };
};

function readStringParam(params: Record<string, unknown>, key: string): string | undefined {
  const value = params[key];
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim();
  return text.length > 0 ? text : undefined;
}

function readNumberParam(params: Record<string, unknown>, key: string, fallback: number, max: number): number {
  const raw = params[key];
  if (raw === undefined || raw === null) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.min(max, Math.floor(parsed)));
}

function readBooleanParam(params: Record<string, unknown>, key: string, fallback: boolean): boolean {
  const raw = params[key];
  if (raw === undefined || raw === null) return fallback;
  return raw === true;
}

function normalizeWhitespace(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

function unwrapValue(value: unknown): unknown {
  if (value && typeof value === "object" && !Array.isArray(value) && "value" in value) {
    return (value as { value: unknown }).value;
  }
  return value;
}

function contentString(content: Record<string, unknown> | undefined, key: string): string | null {
  if (!content) return null;
  const raw = unwrapValue(content[key]);
  if (typeof raw !== "string") return null;
  const text = normalizeWhitespace(raw);
  return text.length > 0 ? text : null;
}

function contentScalar(content: Record<string, unknown> | undefined, key: string): string | number | null {
  if (!content) return null;
  const raw = unwrapValue(content[key]);
  if (typeof raw === "string") {
    const text = normalizeWhitespace(raw);
    return text.length > 0 ? text : null;
  }
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  return null;
}

function contentStringList(content: Record<string, unknown> | undefined, key: string): string[] {
  if (!content) return [];
  const raw = unwrapValue(content[key]);
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is string => typeof item === "string")
    .map((item) => normalizeWhitespace(item))
    .filter((item) => item.length > 0);
}

function truncateText(raw: string | null, maxChars: number): string | null {
  if (!raw) return null;
  if (raw.length <= maxChars) return raw;
  return `${raw.slice(0, maxChars - 1)}…`;
}

function parseNumericSignal(raw: string | number | null): number | null {
  if (raw === null) return null;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw !== "string") return null;
  const m = raw.match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;
  const parsed = Number(m[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function avg(values: number[]): number | null {
  if (values.length === 0) return null;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return Number((sum / values.length).toFixed(3));
}

function selectSubmissionNote(notes: OpenReviewNote[], forumId: string): OpenReviewNote | null {
  const exact = notes.find((note) => note.id === forumId);
  if (exact) return exact;

  const withTitle = notes.find((note) => Boolean(contentString(note.content, "title")));
  if (withTitle) return withTitle;

  const submissionByInvitation = notes.find((note) =>
    (note.invitations ?? []).some((inv) => /\/-\//.test(inv) && /submission/i.test(inv)),
  );
  return submissionByInvitation ?? null;
}

function selectDecisionNote(notes: OpenReviewNote[]): OpenReviewNote | null {
  const candidates = notes.filter((note) => {
    const decision = contentString(note.content, "decision");
    if (decision) return true;
    return (note.invitations ?? []).some((inv) => /decision/i.test(inv));
  });
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => (b.mdate ?? b.tcdate ?? b.cdate ?? 0) - (a.mdate ?? a.tcdate ?? a.cdate ?? 0));
  return candidates[0] ?? null;
}

function collectReviewSummaries(notes: OpenReviewNote[], limit: number): ReviewSummary[] {
  const reviews = notes
    .filter((note) => {
      const invitation = (note.invitations ?? [])[0] ?? "";
      if (/review/i.test(invitation)) return true;
      return Boolean(contentString(note.content, "rating")) || Boolean(contentString(note.content, "confidence"));
    })
    .map((note) => {
      const invitation = (note.invitations ?? [])[0] ?? "";
      const rating = parseNumericSignal(contentScalar(note.content, "rating"));
      const confidence = parseNumericSignal(contentScalar(note.content, "confidence"));
      const summary =
        contentString(note.content, "summary") ??
        contentString(note.content, "main_review") ??
        contentString(note.content, "review") ??
        contentString(note.content, "comment") ??
        contentString(note.content, "strengths") ??
        contentString(note.content, "weaknesses") ??
        contentString(note.content, "limitations") ??
        "";
      return {
        note_id: note.id,
        invitation,
        rating,
        confidence,
        summary: truncateText(summary, SUMMARY_MAX_CHARS) ?? "",
        mdate: note.mdate ?? note.tcdate ?? note.cdate ?? 0,
      };
    });

  const informative = reviews
    .filter((item) => item.rating !== null || item.confidence !== null || item.summary.length > 0)
    .sort((a, b) => {
      const scoreA = (a.rating !== null ? 2 : 0) + (a.confidence !== null ? 1 : 0) + (a.summary.length > 0 ? 1 : 0);
      const scoreB = (b.rating !== null ? 2 : 0) + (b.confidence !== null ? 1 : 0) + (b.summary.length > 0 ? 1 : 0);
      if (scoreA !== scoreB) return scoreB - scoreA;
      return b.mdate - a.mdate;
    })
    .slice(0, Math.max(1, Math.min(MAX_REVIEW_LIMIT, limit)));

  return informative.map(({ mdate: _mdate, ...rest }) => rest);
}

async function fetchNotes(params: Record<string, string>): Promise<OpenReviewNote[]> {
  const urlParams = new URLSearchParams(params);
  const url = `${OPENREVIEW_API_BASE}/notes?${urlParams.toString()}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: buildHeaders(),
    });
  } catch (error) {
    throw new Error(`Failed to reach OpenReview notes endpoint: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenReview notes API returned ${response.status}: ${text || response.statusText}`);
  }

  const data = (await response.json()) as OpenReviewNotesResponse;
  return data.notes ?? [];
}

async function searchNotes(term: string, limit: number): Promise<OpenReviewNote[]> {
  const urlParams = new URLSearchParams({
    term,
    limit: String(limit),
  });
  const url = `${OPENREVIEW_API_BASE}/notes/search?${urlParams.toString()}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: buildHeaders(),
    });
  } catch (error) {
    throw new Error(`Failed to reach OpenReview search endpoint: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenReview search API returned ${response.status}: ${text || response.statusText}`);
  }

  const data = (await response.json()) as OpenReviewNotesResponse;
  return data.notes ?? [];
}

function buildHeaders(): Record<string, string> {
  const token = process.env[OPENREVIEW_TOKEN_ENV]?.trim();
  if (!token) {
    return {
      "User-Agent": "scientify-openreview-lookup/1.0",
    };
  }
  return {
    "User-Agent": "scientify-openreview-lookup/1.0",
    Authorization: `Bearer ${token}`,
  };
}

function normalizeExternalSearchTerm(raw: string): string {
  const value = raw.trim();
  if (!value) return value;
  const lower = value.toLowerCase();
  if (lower.startsWith("arxiv:")) {
    return value.slice(6).trim();
  }
  if (lower.startsWith("doi:")) {
    return value.slice(4).trim();
  }
  return value;
}

async function lookupForum(
  forumId: string,
  includeReviews: boolean,
  reviewLimit: number,
): Promise<ForumLookupResult | null> {
  const notes = await fetchNotes({
    forum: forumId,
    limit: String(DEFAULT_FORUM_NOTES_LIMIT),
  });

  if (notes.length === 0) return null;

  const submission = selectSubmissionNote(notes, forumId);
  if (!submission) return null;

  const content = submission.content ?? {};
  const title = contentString(content, "title");
  const authors = contentStringList(content, "authors");
  const abstractPreview = truncateText(contentString(content, "abstract"), SUMMARY_MAX_CHARS);
  const venue = contentString(content, "venue");
  const venueId = contentString(content, "venueid");
  const pdfUrl = contentString(content, "pdf");

  const decisionNote = selectDecisionNote(notes);
  const decisionValue = decisionNote ? contentString(decisionNote.content, "decision") : null;
  const decisionInvitation = decisionNote ? (decisionNote.invitations ?? [])[0] ?? "unknown" : null;

  const reviewSummaries = includeReviews ? collectReviewSummaries(notes, reviewLimit) : [];
  const ratingValues = reviewSummaries
    .map((review) => review.rating)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  const confidenceValues = reviewSummaries
    .map((review) => review.confidence)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

  return {
    forum_id: forumId,
    paper_id: submission.id,
    title,
    authors,
    abstract_preview: abstractPreview,
    pdf_url: pdfUrl,
    venue,
    venue_id: venueId,
    decision:
      decisionNote && decisionValue
        ? {
            value: decisionValue,
            note_id: decisionNote.id,
            invitation: decisionInvitation ?? "unknown",
          }
        : null,
    review_stats: {
      total_reviews: reviewSummaries.length,
      rated_reviews: ratingValues.length,
      confidence_reviews: confidenceValues.length,
      avg_rating: avg(ratingValues),
      avg_confidence: avg(confidenceValues),
    },
    review_summaries: reviewSummaries,
    links: {
      forum: `${OPENREVIEW_WEB_BASE}/forum?id=${forumId}`,
      note: `${OPENREVIEW_WEB_BASE}/forum?id=${submission.id}`,
    },
  };
}

function dedupeForums(notes: OpenReviewNote[], maxResults: number): string[] {
  const seen = new Set<string>();
  for (const note of notes) {
    const forumId = (note.forum ?? note.id ?? "").trim();
    if (!forumId) continue;
    if (seen.has(forumId)) continue;

    // Keep likely paper/submission entries from mixed search results.
    const hasTitle = Boolean(contentString(note.content, "title"));
    const hasVenue = Boolean(contentString(note.content, "venue"));
    const invitation = (note.invitations ?? [])[0] ?? "";
    const likelySubmission = note.id === forumId || /submission/i.test(invitation) || (hasTitle && hasVenue);
    if (!likelySubmission) continue;

    seen.add(forumId);
    if (seen.size >= maxResults) break;
  }
  return [...seen];
}

export function createOpenReviewLookupTool() {
  return {
    label: "OpenReview Lookup",
    name: "openreview_lookup",
    description:
      "Lookup OpenReview evidence by title or id. Returns forum-level decision, review rating/confidence aggregates, and review summaries for traceable research assessment.",
    parameters: OpenReviewLookupSchema,
    execute: async (_toolCallId: string, rawArgs: unknown) => {
      const params = (rawArgs ?? {}) as Record<string, unknown>;

      const query = readStringParam(params, "query");
      const paperId = readStringParam(params, "paper_id");
      const forumId = readStringParam(params, "forum_id");
      const externalId = readStringParam(params, "external_id");
      const maxResults = readNumberParam(params, "max_results", DEFAULT_MAX_RESULTS, MAX_RESULTS_LIMIT);
      const includeReviews = readBooleanParam(params, "include_reviews", true);
      const reviewLimit = readNumberParam(params, "review_limit", DEFAULT_REVIEW_LIMIT, MAX_REVIEW_LIMIT);

      if (!query && !paperId && !forumId && !externalId) {
        return Result.err(
          "invalid_params",
          "Provide at least one of: `query`, `paper_id`, `forum_id`, `external_id`.",
        );
      }

      try {
        const targets: string[] = [];
        let mode = "query";

        if (forumId) {
          mode = "forum_id";
          targets.push(forumId);
        } else if (paperId) {
          mode = "paper_id";
          const notes = await fetchNotes({ id: paperId, limit: "1" });
          const note = notes[0];
          if (!note) {
            return Result.ok({
              mode,
              input: paperId,
              returned: 0,
              results: [],
              warning: "No note found for provided paper_id.",
            });
          }
          targets.push((note.forum ?? note.id).trim());
        } else if (externalId) {
          mode = "external_id";
          const term = normalizeExternalSearchTerm(externalId);
          const notes = await searchNotes(term, maxResults * SEARCH_FANOUT);
          targets.push(...dedupeForums(notes, maxResults));
        } else if (query) {
          mode = "query";
          const notes = await searchNotes(query, maxResults * SEARCH_FANOUT);
          targets.push(...dedupeForums(notes, maxResults));
        }

        const uniqueTargets = [...new Set(targets.map((item) => item.trim()).filter((item) => item.length > 0))].slice(
          0,
          maxResults,
        );

        const results: ForumLookupResult[] = [];
        for (const targetForum of uniqueTargets) {
          const forum = await lookupForum(targetForum, includeReviews, reviewLimit);
          if (!forum) continue;
          results.push(forum);
        }

        return Result.ok({
          mode,
          input: forumId ?? paperId ?? externalId ?? query,
          returned: results.length,
          results,
          hints:
            results.length === 0
              ? [
                  "Try a more specific paper title or pass `forum_id` / `paper_id` directly.",
                  "For broad queries, OpenReview may return mixed notes; use exact title keywords to improve precision.",
                ]
              : undefined,
        });
      } catch (error) {
        return Result.err(
          "runtime_error",
          `openreview_lookup failed: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    },
  };
}
