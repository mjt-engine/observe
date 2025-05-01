import { LogEntry } from "../type/LogEntry";
import { TraceId } from "../type/TraceId";
import { LogMatcher } from "./LogMatcher";
import { Stats } from "./Stats";
export type ObserveAgent = {
    start: (traceId: TraceId, ...extra: unknown[]) => void;
    log: (entry: LogEntry) => void;
    end: (traceId: TraceId, ...extra: unknown[]) => void;
    getStats: (traceId: TraceId) => Stats;
    getTraceIds: () => TraceId[];
    updateLogMatchers: (fn: (logMatchers: (RegExp | string | LogMatcher)[]) => (string | LogMatcher)[]) => (string | LogMatcher)[];
};
export declare const ObserveAgent: ({ logMatchers, logger, clock, maxSampleSize, }?: Partial<{
    logMatchers: (string | LogMatcher)[];
    logger: typeof console.log;
    clock: {
        now: () => number;
    };
    maxSampleSize: number;
}>) => ObserveAgent;
