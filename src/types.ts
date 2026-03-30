/**
 * Re-export SDK types and derive types not directly exported.
 */
import type {
  OpenClawPluginApi,
  PluginCommandContext,
  OpenClawPluginCommandDefinition,
} from "openclaw/plugin-sdk/plugin-entry";

export type { OpenClawPluginApi, PluginCommandContext };

/** Derived from the return type of command handlers */
export type PluginCommandResult = Awaited<
  ReturnType<OpenClawPluginCommandDefinition["handler"]>
>;
