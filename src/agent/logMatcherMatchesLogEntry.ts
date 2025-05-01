import { isDefined, safe } from "@mjt-engine/object";
import { LogEntry } from "../type/LogEntry";
import { LogMatcher } from "./LogMatcher";

export const logMatcherMatchesLogEntry =
  (logMatcher: RegExp | string | LogMatcher) => (logEntry: LogEntry) => {
    if (typeof logMatcher === "string" || logMatcher instanceof RegExp) {
      return safeRegexpTest(logMatcher, logEntry.traceId);
    }
    const {
      traceId,
      message,
      extra = () => true,
      timestamp = () => true,
    } = logMatcher;
    if (isDefined(traceId) && !safeRegexpTest(traceId, logEntry.traceId)) {
      return false;
    }
    if (isDefined(message) && !safeRegexpTest(message, logEntry.message)) {
      return false;
    }
    if (isDefined(logEntry.timestamp) && !timestamp(logEntry.timestamp)) {
      return false;
    }
    if (isDefined(logEntry.extra) && !extra(logEntry.extra)) {
      return false;
    }
    return true;
  };

const safeRegexpTest = (
  regexp: string | RegExp,
  value: string,
  flags = "m"
) => {
  if (typeof regexp === "string") {
    return safe(() => new RegExp(regexp, flags).test(value), {
      default: false,
      quiet: true,
    });
  }
  return safe(() => regexp.test(value), {
    default: false,
    quiet: true,
  });
};
