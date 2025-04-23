import { LogEntry } from "./LogEntry";
import { TraceId } from "./TraceId";
import { traceIdMatches } from "./traceIdMatches";

export type ObserveAgent = {
  start: (traceId: TraceId, ...extra: unknown[]) => void;
  addLog: (entry: LogEntry) => void;
  end: (traceId: TraceId, ...extra: unknown[]) => void;
};

export const ObserveAgent = ({
  logMatchers = [],
  logger = console.log,
  clock = performance,
}: Partial<{
  logMatchers: TraceId[];
  logger: typeof console.log;
  clock: { now: () => number };
}> = {}): ObserveAgent => {
  const mod: ObserveAgent = {
    start: (traceId, ...extra) => {
      mod.addLog({ traceId, message: "start", extra });
    },
    addLog: ({ traceId, message, timestamp = clock.now(), extra = [] }) => {
      if (!traceIdMatches(logMatchers)(traceId)) {
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
