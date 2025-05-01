import { LogEntry } from "../type/LogEntry";
import { LogMatcher } from "./LogMatcher";
export declare const transformLogEntry: (matcher: RegExp | string | LogMatcher) => (logEntry: LogEntry) => LogEntry;
