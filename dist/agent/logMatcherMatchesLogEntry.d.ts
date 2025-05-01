import { LogEntry } from "../type/LogEntry";
import { LogMatcher } from "./LogMatcher";
export declare const logMatcherMatchesLogEntry: (logMatcher: RegExp | string | LogMatcher) => (logEntry: LogEntry) => boolean | undefined;
