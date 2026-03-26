/**
 * Re-export SDK types and derive types not directly exported.
 *
 * OpenClaw plugin-entry exports OpenClawPluginApi, PluginCommandContext,
 * PluginLogger, etc. — but not PluginRuntime, PluginCommandResult, or
 * RunCommandResult. We derive those from the exported interfaces.
 */
import type {
  OpenClawPluginApi,
  PluginCommandContext,
  PluginLogger,
  OpenClawPluginCommandDefinition,
} from "openclaw/plugin-sdk/plugin-entry";

export type {
  OpenClawPluginApi,
  PluginCommandContext,
  PluginLogger,
  OpenClawPluginCommandDefinition,
};

/** Derived from OpenClawPluginApi["runtime"] */
export type PluginRuntime = OpenClawPluginApi["runtime"];

/** Derived from the return type of command handlers */
export type PluginCommandResult = Awaited<
  ReturnType<OpenClawPluginCommandDefinition["handler"]>
>;

/** Derived from runtime.system.runCommandWithTimeout return type */
export type RunCommandResult = Awaited<
  ReturnType<PluginRuntime["system"]["runCommandWithTimeout"]>
>;
