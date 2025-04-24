import { LogEntry } from "../type/LogEntry";
import { TraceId } from "../type/TraceId";
import { LogMatcher } from "./LogMatcher";
import { Stats } from "./Stats";
export type ObserveAgent = {
    start: (traceId: TraceId, ...extra: unknown[]) => void;
    addLog: (entry: LogEntry) => void;
    end: (traceId: TraceId, ...extra: unknown[]) => void;
    getStats: (traceId: TraceId) => Stats;
};
export declare const ObserveAgent: ({ logMatchers, logger, clock, }?: Partial<{
    logMatchers: (string | LogMatcher)[];
    logger: typeof console.log;
    clock: {
        now: () => number;
    };
}>) => ObserveAgent;
