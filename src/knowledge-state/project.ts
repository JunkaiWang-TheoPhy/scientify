import { createHash } from "node:crypto";
import fs from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export type ProjectContext = {
  projectId: string;
  projectPath: string;
  created: boolean;
};

const PROJECT_ROOT = path.join(os.homedir(), ".openclaw", "workspace", "projects");
const ACTIVE_PROJECT_FILE = path.join(PROJECT_ROOT, ".active");

function normalizeText(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

function slugify(raw: string): string {
  const normalized = normalizeText(raw)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || "topic";
}

function readActiveProjectId(): string | undefined {
  try {
    const raw = fs.readFileSync(ACTIVE_PROJECT_FILE, "utf-8").trim();
    if (!raw) return undefined;
    const cleaned = slugify(raw);
    return cleaned.length > 0 ? cleaned : undefined;
  } catch {
    return undefined;
  }
}

function projectExists(projectId: string): boolean {
  const projectPath = path.join(PROJECT_ROOT, projectId);
  return fs.existsSync(projectPath) && fs.statSync(projectPath).isDirectory();
}

function deriveAutoProjectId(scope: string, topic: string): string {
  const scopeSlug = slugify(scope).slice(0, 18);
  const topicSlug = slugify(topic).slice(0, 28);
  const hash = createHash("sha1")
    .update(`${scope}\n${topic}`)
    .digest("hex")
    .slice(0, 6);
  return `auto-${topicSlug}-${scopeSlug}-${hash}`;
}

async function ensureProjectScaffold(projectId: string, topic: string): Promise<boolean> {
  const projectPath = path.join(PROJECT_ROOT, projectId);
  if (projectExists(projectId)) {
    return false;
  }

  await mkdir(projectPath, { recursive: true });

  const createdAt = new Date().toISOString();
  const projectJsonPath = path.join(projectPath, "project.json");
  const taskJsonPath = path.join(projectPath, "task.json");

  if (!fs.existsSync(projectJsonPath)) {
    await writeFile(
      projectJsonPath,
      JSON.stringify(
        {
          id: projectId,
          name: topic,
          created: createdAt,
          topics: [topic],
        },
        null,
        2,
      ),
      "utf-8",
    );
  }

  if (!fs.existsSync(taskJsonPath)) {
    await writeFile(
      taskJsonPath,
      JSON.stringify(
        {
          domain: topic,
          focus: topic,
          created: createdAt,
        },
        null,
        2,
      ),
      "utf-8",
    );
  }

  return true;
}

export async function resolveProjectContext(args: {
  projectId?: string;
  scope: string;
  topic: string;
  autoCreate?: boolean;
}): Promise<ProjectContext> {
  const explicitProjectId = args.projectId ? slugify(args.projectId) : undefined;
  const activeProjectId = readActiveProjectId();

  const picked = explicitProjectId || activeProjectId || deriveAutoProjectId(args.scope, args.topic);
  const autoCreate = args.autoCreate !== false;
  const created = autoCreate ? await ensureProjectScaffold(picked, args.topic) : false;
  if (!autoCreate && !projectExists(picked)) {
    throw new Error(`project not found: ${picked}`);
  }

  return {
    projectId: picked,
    projectPath: path.join(PROJECT_ROOT, picked),
    created,
  };
}

export function getProjectRootPath(): string {
  return PROJECT_ROOT;
}
