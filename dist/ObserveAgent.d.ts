import { LogEntry } from "./LogEntry";
import { TraceId } from "./TraceId";
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
export declare const logMatcherMatchesLogEntry: (logMatcher: string | LogMatcher) => (logEntry: LogEntry) => boolean;
export declare const atLeastOneLogMatcherMatchesLogEntry: (logMatchers: (string | LogMatcher)[]) => (logEntry: LogEntry) => string | false | Partial<{
    traceId: string;
    message: string;
    timestamp: (timestamp: number) => boolean;
    extra: (extra: unknown[]) => boolean;
    transform: (logEntry: LogEntry) => LogEntry;
}>;
export declare const transformLogEntry: (matcher: string | LogMatcher) => (logEntry: LogEntry) => LogEntry;
export declare const ObserveAgent: ({ logMatchers, logger, clock, }?: Partial<{
    logMatchers: (string | LogMatcher)[];
    logger: typeof console.log;
    clock: {
        now: () => number;
    };
}>) => ObserveAgent;
