import { safe } from "@mjt-engine/object";
import { LogEntry } from "../type/LogEntry";
import { LogMatcher } from "./LogMatcher";

export const logMatcherMatchesLogEntry =
  (logMatcher: string | LogMatcher) => (logEntry: LogEntry) => {
    if (typeof logMatcher === "string") {
      return safe(() => new RegExp(logMatcher).test(logEntry.traceId), {
        default: false,
        quiet: true,
      });
    }
    const {
      traceId,
      message,
      extra = () => true,
      timestamp = () => true,
    } = logMatcher;
    if (traceId && !new RegExp(traceId).test(logEntry.traceId)) {
      return false;
    }
    if (message && !new RegExp(message).test(logEntry.message)) {
      return false;
    }
    if (logEntry.timestamp && !timestamp(logEntry.timestamp)) {
      return false;
    }
    if (logEntry.extra && !extra(logEntry.extra)) {
      return false;
    }
    return true;
  };
