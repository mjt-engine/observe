import { LogEntry } from "../type/LogEntry";
import { LogMatcher } from "../type/LogMatcher";
export declare const atLeastOneLogMatcherMatchesLogEntry: (logMatchers: (RegExp | string | LogMatcher)[]) => (logEntry: LogEntry) => string | false | RegExp | Partial<{
    traceId: string | RegExp;
    message: string | RegExp;
    timestamp: (timestamp?: number) => boolean;
    extra: (extra?: unknown[]) => boolean;
    transform: (logEntry: LogEntry) => LogEntry;
}>;
