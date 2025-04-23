import { LogEntry } from "./LogEntry";
import { TraceId } from "./TraceId";
import { traceIdMatches } from "./traceIdMatches";

export type ObserveAgent = {
  start: (traceId: TraceId, ...extra: unknown[]) => void;
  addLog: (entry: LogEntry) => void;
  end: (traceId: TraceId, ...extra: unknown[]) => void;
};

export type LogMatcher = Partial<{
  traceId: string;
  message: string;
  timestamp: (timestamp: number) => boolean;
  extra: (extra: unknown[]) => boolean;
  transform: (logEntry: LogEntry) => LogEntry;
}>;

export const logMatcherMatchesLogEntry =
  (logMatcher: string | LogMatcher) => (logEntry: LogEntry) => {
    if (typeof logMatcher === "string") {
      return new RegExp(logMatcher).test(logEntry.traceId);
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

export const atLeastOneLogMatcherMatchesLogEntry =
  (logMatchers: (string | LogMatcher)[]) => (logEntry: LogEntry) => {
    for (const logMatcher of logMatchers) {
      if (logMatcherMatchesLogEntry(logMatcher)(logEntry)) {
        return logMatcher;
      }
    }
    return false;
  };

export const transformLogEntry =
  (matcher: string | LogMatcher) => (logEntry: LogEntry) => {
    if (typeof matcher === "string") {
      return logEntry;
    }
    if (matcher.transform) {
      return matcher.transform(logEntry);
    }
    return logEntry;
  };

export const ObserveAgent = ({
  logMatchers = [],
  logger = console.log,
  clock = performance,
}: Partial<{
  logMatchers: (string | LogMatcher)[];
  logger: typeof console.log;
  clock: { now: () => number };
}> = {}): ObserveAgent => {
  const mod: ObserveAgent = {
    start: (traceId, ...extra) => {
      mod.addLog({ traceId, message: "start", extra });
    },
    addLog: ({ traceId, message, timestamp = clock.now(), extra = [] }) => {
      const logEntry: LogEntry = {
        traceId,
        message,
        timestamp,
        extra,
      };
      const logMatcherMaybe =
        atLeastOneLogMatcherMatchesLogEntry(logMatchers)(logEntry);
      if (!logMatcherMaybe) {
        return;
      }
      const transformedLogEntry = transformLogEntry(logMatcherMaybe)(logEntry);
      logger(
        `${transformedLogEntry.timestamp} ${transformedLogEntry.traceId}: ${transformedLogEntry.message}`,
        ...(transformedLogEntry.extra ?? [])
      );
    },
    end: (traceId, ...extra) => {
      mod.addLog({ traceId, message: "end", extra });
    },
  };
  return mod;
};
