import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import type { PluginCommandContext, PluginCommandResult } from "./types.js";

const OPENCLAW_HOME = path.join(os.homedir(), ".openclaw");

interface ResearchAgent {
  id: string;
  workspace: string;
}

interface ProjectSnapshot {
  hasConfig: boolean;
  hasSurvey: boolean;
  hasSelection: boolean;
  hasPlan: boolean;
  hasDataValidation: boolean;
  hasBaseline: boolean;
  hasImplementationReport: boolean;
  latestReviewVerdict: "PASS" | "NEEDS_REVISION" | "NEEDS_ALGORITHM_REVIEW" | "BLOCKED" | "MISSING" | "UNKNOWN";
  hasExperiment: boolean;
}

interface NextActionState {
  stage: string;
  command: string;
  expectedOutputs: string[];
  reason: string;
}

/**
 * List all research agents from openclaw.json.
 */
function listResearchAgents(): ResearchAgent[] {
  const configPath = path.join(OPENCLAW_HOME, "openclaw.json");
  try {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const agents = (config.agents as { list?: Array<{ id: string; workspace?: string }> })?.list ?? [];
    return agents
      .filter((a) => a.id.startsWith("research-"))
      .map((a) => ({
        id: a.id,
        workspace: (a.workspace ?? `~/.openclaw/workspace-${a.id}`).replace("~", os.homedir()),
      }));
  } catch {
    return [];
  }
}

function countFiles(dirPath: string, filter?: (name: string) => boolean): number {
  try {
    const entries = fs.readdirSync(dirPath);
    return filter ? entries.filter(filter).length : entries.length;
  } catch {
    return 0;
  }
}

function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function readLatestReviewVerdict(workspace: string): ProjectSnapshot["latestReviewVerdict"] {
  const iterationsDir = path.join(workspace, "iterations");
  if (!fileExists(iterationsDir)) return "MISSING";

  try {
    const files = fs.readdirSync(iterationsDir)
      .filter((f) => /^judge_v\d+\.md$/.test(f))
      .sort((a, b) => {
        const na = Number(a.match(/\d+/)?.[0] ?? "0");
        const nb = Number(b.match(/\d+/)?.[0] ?? "0");
        return nb - na;
      });

    const latest = files[0];
    if (!latest) return "MISSING";

    const content = fs.readFileSync(path.join(iterationsDir, latest), "utf-8");
    const verdictMatch = content.match(/##\s+Verdict:\s+([A-Z_]+)/);
    const verdict = verdictMatch?.[1] as ProjectSnapshot["latestReviewVerdict"] | undefined;
    return verdict ?? "UNKNOWN";
  } catch {
    return "UNKNOWN";
  }
}

function buildProjectSnapshot(workspace: string): ProjectSnapshot {
  return {
    hasConfig: fileExists(path.join(workspace, "config.json")),
    hasSurvey: fileExists(path.join(workspace, "survey_res.md")),
    hasSelection: fileExists(path.join(workspace, "selection_res.md")),
    hasPlan: fileExists(path.join(workspace, "plan_res.md")),
    hasDataValidation: fileExists(path.join(workspace, "data_validation.md")),
    hasBaseline: fileExists(path.join(workspace, "baseline_res.md")),
    hasImplementationReport: fileExists(path.join(workspace, "ml_res.md")),
    latestReviewVerdict: readLatestReviewVerdict(workspace),
    hasExperiment: fileExists(path.join(workspace, "experiment_res.md")),
  };
}

function inferNextAction(snapshot: ProjectSnapshot): NextActionState {
  if (!snapshot.hasConfig) {
    return {
      stage: "Bootstrap pending",
      command: "完成 BOOTSTRAP 配置",
      expectedOutputs: ["config.json", "SOUL.md"],
      reason: "项目还没有基础配置，后续 survey、selection 和 experiment 没有统一方向依据。",
    };
  }

  if (!snapshot.hasSurvey) {
    return {
      stage: "Survey needed",
      command: "/research-survey",
      expectedOutputs: ["knowledge/", "survey_res.md"],
      reason: "当前还没有深度调研结果，无法可靠进入路线选择和实现。",
    };
  }

  if (!snapshot.hasSelection && !snapshot.hasPlan) {
    return {
      stage: "Route selection",
      command: "/algorithm-selection",
      expectedOutputs: ["selection_res.md"],
      reason: "已经有 survey，但还没有把候选路线收敛成 Chosen / Rejected / Fallback。",
    };
  }

  if (!snapshot.hasPlan) {
    return {
      stage: "Planning",
      command: "/research-plan",
      expectedOutputs: ["plan_res.md"],
      reason: "还缺 Dataset / Model / Training / Testing 四部分计划。",
    };
  }

  if (!snapshot.hasDataValidation) {
    return {
      stage: "Dataset validation",
      command: "/dataset-validate",
      expectedOutputs: ["data_validation.md"],
      reason: "先把数据真实性、split、label 和 leakage 风险单独审清楚，再做模型质量判断。",
    };
  }

  if (!snapshot.hasBaseline) {
    return {
      stage: "Baseline setup",
      command: "/baseline-runner",
      expectedOutputs: ["baseline_res.md", "experiments/baselines/"],
      reason: "当前还缺统一协议下的 baseline 结果，不适合直接写 headline comparison。",
    };
  }

  if (!snapshot.hasImplementationReport) {
    return {
      stage: "Implementation",
      command: "/research-implement",
      expectedOutputs: ["project/", "ml_res.md"],
      reason: "路线、计划、数据检查和 baseline 契约都已经具备，下一步应进入实现和 2 epoch 验证。",
    };
  }

  if (snapshot.latestReviewVerdict !== "PASS") {
    return {
      stage: "Review",
      command: "/research-review",
      expectedOutputs: ["iterations/judge_v{N}.md"],
      reason: "实现已经存在，但还没有拿到 review PASS，模型质量还需要单独审。",
    };
  }

  if (!snapshot.hasExperiment) {
    return {
      stage: "Full experiment",
      command: "/research-experiment",
      expectedOutputs: ["experiment_res.md", "experiment_analysis/"],
      reason: "实现和 review 已通过，下一步应补 full training、ablation 和补充实验。",
    };
  }

  return {
    stage: "Experiment complete",
    command: "/write-review-paper",
    expectedOutputs: ["review/"],
    reason: "核心机器学习主链已经跑完，可以进入总结、综述或对外整理阶段。",
  };
}

function formatArtifactPresence(snapshot: ProjectSnapshot): string {
  const items = [
    ["survey", snapshot.hasSurvey],
    ["selection", snapshot.hasSelection],
    ["plan", snapshot.hasPlan],
    ["data_validation", snapshot.hasDataValidation],
    ["baseline", snapshot.hasBaseline],
    ["implement", snapshot.hasImplementationReport],
    ["review", snapshot.latestReviewVerdict === "PASS"],
    ["experiment", snapshot.hasExperiment],
  ];

  return items.map(([label, ok]) => `${ok ? "yes" : "no"} ${label}`).join(" | ");
}

/**
 * /research-status - Show workspace status for all research agents
 */
export function handleResearchStatus(_ctx: PluginCommandContext): PluginCommandResult {
  const agents = listResearchAgents();

  if (agents.length === 0) {
    return { text: "No research projects found. Use `openclaw research init <id>` to create one." };
  }

  let output = "**Research Projects**\n\n";

  for (const agent of agents) {
    const projectId = agent.id.replace("research-", "");
    const w = agent.workspace;

    const papersCount = countFiles(path.join(w, "papers"), (f) => f.endsWith(".tex") || f.endsWith(".pdf"));
    const ideasCount = countFiles(path.join(w, "ideas"), (f) => f.endsWith(".md"));
    const topicCount = countFiles(path.join(w, "knowledge"), (f) => f.startsWith("topic-"));
    const hypothesisCount = countFiles(path.join(w, "ideas"), (f) => f.startsWith("hyp-"));
    const snapshot = buildProjectSnapshot(w);
    const next = inferNextAction(snapshot);

    let currentDay = 0;
    try {
      const config = JSON.parse(fs.readFileSync(path.join(w, "config.json"), "utf-8"));
      currentDay = config.currentDay ?? 0;
    } catch { /* not yet bootstrapped */ }

    output += `**${projectId}** (Day ${currentDay})\n`;
    output += `  Workspace: \`${w}\`\n`;
    output += `  Topics: ${topicCount} | Hypotheses: ${hypothesisCount} | Papers: ${papersCount} | Ideas: ${ideasCount}\n`;
    output += `  Stage: ${next.stage}\n`;
    output += `  Artifacts: ${formatArtifactPresence(snapshot)}\n`;
    output += `  Next: \`${next.command}\`\n`;
    output += `  Why: ${next.reason}\n`;
    output += `  Expected: ${next.expectedOutputs.map((p) => `\`${p}\``).join(", ")}\n\n`;
  }

  return { text: output };
}

/**
 * /papers - List downloaded papers in a research agent workspace
 */
export function handlePapers(ctx: PluginCommandContext): PluginCommandResult {
  const agent = resolveAgent(ctx.args?.trim());
  if (!agent) {
    return { text: "No research project found. Use `openclaw research init <id>` to create one." };
  }

  const papersDir = path.join(agent.workspace, "papers");
  if (!fs.existsSync(papersDir)) {
    return { text: `No papers directory in project ${agent.id}.` };
  }

  const downloadsDir = path.join(papersDir, "_downloads");
  let output = `**Papers — ${agent.id.replace("research-", "")}**\n\n`;
  let hasItems = false;

  try {
    const entries = fs.readdirSync(downloadsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const texCount = fs.readdirSync(path.join(downloadsDir, entry.name)).filter((f) => f.endsWith(".tex")).length;
        output += `  [tex] \`${entry.name}\` (${texCount} files)\n`;
        hasItems = true;
      } else if (entry.name.endsWith(".pdf")) {
        output += `  [pdf] \`${entry.name.replace(".pdf", "")}\`\n`;
        hasItems = true;
      }
    }
  } catch { /* empty */ }

  if (!hasItems) output += "_No papers downloaded yet._";
  return { text: output };
}

/**
 * /ideas - List generated ideas in a research agent workspace
 */
export function handleIdeas(ctx: PluginCommandContext): PluginCommandResult {
  const agent = resolveAgent(ctx.args?.trim());
  if (!agent) {
    return { text: "No research project found. Use `openclaw research init <id>` to create one." };
  }

  const ideasDir = path.join(agent.workspace, "ideas");
  if (!fs.existsSync(ideasDir)) {
    return { text: `No ideas in project ${agent.id.replace("research-", "")}.` };
  }

  const files = fs.readdirSync(ideasDir).filter((f) => f.endsWith(".md"));
  let output = `**Ideas — ${agent.id.replace("research-", "")}**\n\n`;

  if (files.length === 0) {
    output += "_No ideas generated yet._";
  } else {
    for (const file of files) {
      const content = fs.readFileSync(path.join(ideasDir, file), "utf-8");
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : file;
      const isSelected = file === "selected_idea.md";
      const marker = isSelected ? "* " : "  ";
      output += `${marker}\`${file}\` ${title}\n`;
    }
  }

  return { text: output };
}

/**
 * /projects - List all research projects (alias for /research-status)
 */
export function handleProjects(_ctx: PluginCommandContext): PluginCommandResult {
  return handleResearchStatus(_ctx);
}

/**
 * /project-switch - No longer needed (each agent has its own workspace)
 */
export function handleProjectSwitch(_ctx: PluginCommandContext): PluginCommandResult {
  return { text: "Project switching is no longer needed. Each research agent has its own workspace. Use `openclaw research list` to see all projects." };
}

/**
 * /project-delete - Delete via CLI instead
 */
export function handleProjectDelete(_ctx: PluginCommandContext): PluginCommandResult {
  return { text: "Use `openclaw research delete <id>` to delete a research project." };
}

/**
 * Resolve which research agent to use.
 * If an arg is given, match by project id; otherwise use the first (or only) agent.
 */
function resolveAgent(arg?: string): ResearchAgent | null {
  const agents = listResearchAgents();
  if (agents.length === 0) return null;

  if (arg) {
    const agentId = arg.startsWith("research-") ? arg : `research-${arg}`;
    return agents.find((a) => a.id === agentId) ?? null;
  }

  return agents[0] ?? null;
}
