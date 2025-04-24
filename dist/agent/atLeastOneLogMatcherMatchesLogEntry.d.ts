import { LogEntry } from "../type/LogEntry";
import { LogMatcher } from "./LogMatcher";
export declare const atLeastOneLogMatcherMatchesLogEntry: (logMatchers: (string | LogMatcher)[]) => (logEntry: LogEntry) => string | false | Partial<{
    traceId: string;
    message: string;
    timestamp: (timestamp: number) => boolean;
    extra: (extra: unknown[]) => boolean;
    transform: (logEntry: LogEntry) => LogEntry;
}>;
