import { LogEntry } from "../type/LogEntry";
import { LogMatcher } from "./LogMatcher";

export const transformLogEntry =
  (matcher: RegExp | string | LogMatcher) => (logEntry: LogEntry) => {
    if (typeof matcher === "string" || matcher instanceof RegExp) {
      return logEntry;
    }
    if (matcher.transform) {
      return matcher.transform(logEntry);
    }
    return logEntry;
  };
