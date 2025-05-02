import { Cache, Caches } from "@mjt-engine/cache";
import { LogEntry } from "../type/LogEntry";
import { TraceId } from "../type/TraceId";
import { LogMatcher } from "../type/LogMatcher";
import { atLeastOneLogMatcherMatchesLogEntry } from "./atLeastOneLogMatcherMatchesLogEntry";
import { transformLogEntry } from "./transformLogEntry";
import { Stats } from "./Stats";

export type ObserveAgent = {
  start: (traceId: TraceId, ...extra: unknown[]) => void;
  log: (entry: LogEntry) => void;
  end: (traceId: TraceId, ...extra: unknown[]) => void;
  getStats: (traceId: TraceId) => Stats;
  getTraceIds: () => TraceId[];
  updateLogMatchers: (
    fn: (
      logMatchers: (RegExp | string | LogMatcher)[]
    ) => (string | LogMatcher)[]
  ) => (string | LogMatcher)[];
};

export const ObserveAgent = ({
  logMatchers = [],
  logger = console.log,
  clock = performance,
  maxSampleSize = 100,
}: Partial<{
  logMatchers: (string | LogMatcher)[];
  logger: typeof console.log;
  clock: { now: () => number };
  maxSampleSize: number;
}> = {}): ObserveAgent => {
  const stats = Caches.create<Stats>();

  const mod: ObserveAgent = {
    updateLogMatchers: (fn) => {
      const newLogMatchers = fn(logMatchers);
      logMatchers = newLogMatchers;
      return newLogMatchers;
    },
    getTraceIds: () => stats.entries().map(([traceId]) => traceId as TraceId),
    start: (traceId, ...extra) => {
      mod.getStats(traceId).count();
      mod.getStats(traceId).time();
    },
    getStats: (traceId) => stats.get(traceId, () => Stats(maxSampleSize))!,

    log: ({ traceId, message, timestamp = clock.now(), extra = [] }) => {
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
      mod.getStats(traceId).lastTime()?.end();
    },
  };
  return mod;
};
