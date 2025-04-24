import { Cache, Caches } from "@mjt-engine/cache";
import { LogEntry } from "../type/LogEntry";
import { TraceId } from "../type/TraceId";
import { LogMatcher } from "./LogMatcher";
import { atLeastOneLogMatcherMatchesLogEntry } from "./atLeastOneLogMatcherMatchesLogEntry";
import { transformLogEntry } from "./transformLogEntry";
import { Stats } from "./Stats";

export type ObserveAgent = {
  start: (traceId: TraceId, ...extra: unknown[]) => void;
  addLog: (entry: LogEntry) => void;
  end: (traceId: TraceId, ...extra: unknown[]) => void;
  getStats: (traceId: TraceId) => Stats;
  getTraceIds: () => TraceId[];
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
  const stats = Caches.create<Stats>();

  const mod: ObserveAgent = {
    getTraceIds: () => stats.entries().map(([traceId]) => traceId as TraceId),
    start: (traceId, ...extra) => {
      mod.getStats(traceId).count();
      mod.getStats(traceId).time();
      mod.addLog({ traceId, message: "start", extra });
    },
    getStats: (traceId) => stats.get(traceId, () => Stats())!,

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
      mod.getStats(traceId).lastTime()?.end();
      mod.addLog({ traceId, message: "end", extra });
    },
  };
  return mod;
};
