import { LogEntry } from "../type/LogEntry";
export type LogMatcher = Partial<{
    traceId: string;
    message: string;
    timestamp: (timestamp: number) => boolean;
    extra: (extra: unknown[]) => boolean;
    transform: (logEntry: LogEntry) => LogEntry;
}>;
