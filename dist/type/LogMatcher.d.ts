import { LogEntry } from "./LogEntry";
export type LogMatcher = Partial<{
    traceId: string | RegExp;
    message: string | RegExp;
    timestamp: (timestamp?: number) => boolean;
    extra: (extra?: unknown[]) => boolean;
    transform: (logEntry: LogEntry) => LogEntry;
}>;
