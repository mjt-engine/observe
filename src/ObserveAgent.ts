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
        return true;
      }
    }
    return false;
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
      if (
        !atLeastOneLogMatcherMatchesLogEntry(logMatchers)({
          traceId,
          message,
          timestamp,
          extra,
        })
      ) {
        return;
      }
      logger(`${timestamp} ${traceId}: ${message}`, ...extra);
    },
    end: (traceId, ...extra) => {
      mod.addLog({ traceId, message: "end", extra });
    },
  };
  return mod;
};
