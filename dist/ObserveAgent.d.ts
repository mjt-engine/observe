import { LogEntry } from "./LogEntry";
import { TraceId } from "./TraceId";
export type ObserveAgent = {
    start: (traceId: TraceId, ...extra: unknown[]) => void;
    addLog: (entry: LogEntry) => void;
    end: (traceId: TraceId, ...extra: unknown[]) => void;
};
export declare const ObserveAgent: ({ matchers, logger, clock, }?: Partial<{
    matchers: TraceId[];
    logger: typeof console.log;
    clock: {
        now: () => number;
    };
}>) => ObserveAgent;
