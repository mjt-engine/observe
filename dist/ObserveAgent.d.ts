import { LogEntry } from "./LogEntry";
import { TraceId } from "./TraceId";
export type ObserveAgent = {
    start: (traceId: TraceId, ...extra: unknown[]) => void;
    addLog: (entry: LogEntry) => void;
    end: (traceId: TraceId, ...extra: unknown[]) => void;
};
export declare const ObserveAgent: ({ logMatchers, logger, clock, }?: Partial<{
    logMatchers: TraceId[];
    logger: typeof console.log;
    clock: {
        now: () => number;
    };
}>) => ObserveAgent;
