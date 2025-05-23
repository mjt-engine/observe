import { LogEntry } from "../type/LogEntry";
import { LogMatcher } from "../type/LogMatcher";
import { logMatcherMatchesLogEntry } from "./logMatcherMatchesLogEntry";

export const atLeastOneLogMatcherMatchesLogEntry =
  (logMatchers: (RegExp | string | LogMatcher)[]) => (logEntry: LogEntry) => {
    for (const logMatcher of logMatchers) {
      if (logMatcherMatchesLogEntry(logMatcher)(logEntry)) {
        return logMatcher;
      }
    }
    return false;
  };
