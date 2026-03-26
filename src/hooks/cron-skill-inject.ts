import fs from "node:fs/promises";
import path from "node:path";

/**
 * Hook for injecting SKILL.md content into cron session messages.
 *
 * When a cron job fires with a heartbeat message starting with `/skill-name`,
 * this hook reads the matching SKILL.md from the agent's workspace and
 * prepends its body via prependContext, so the agent receives full workflow
 * instructions in the isolated cron session.
 */
export function createCronSkillInjectionHook() {
  return async (
    event: { prompt?: string; messages?: unknown[]; [key: string]: unknown },
    ctx: { trigger?: string; workspaceDir?: string; [key: string]: unknown },
  ): Promise<{ prependContext: string } | void> => {
    // Only process cron sessions
    if (ctx.trigger !== "cron") return;

    const message = typeof event.prompt === "string" ? event.prompt : "";
    if (!message) return;

    // Extract /skill-name from the first line
    const match = message.match(/^\/([a-z][\w-]*)/);
    if (!match) return;
    const skillName = match[1];

    // Resolve agent workspace
    const workspace = ctx.workspaceDir;
    if (typeof workspace !== "string") return;

    const skillPath = path.join(workspace, "skills", skillName, "SKILL.md");

    let content: string;
    try {
      content = await fs.readFile(skillPath, "utf-8");
    } catch {
      // No SKILL.md found in workspace — skip
      return;
    }

    // Strip YAML frontmatter
    const body = content.replace(/^---[\s\S]*?---\s*/, "").trim();
    if (!body) return;

    return { prependContext: body };
  };
}
