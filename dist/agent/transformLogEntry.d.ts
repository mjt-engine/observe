import { LogEntry } from "../type/LogEntry";
import { LogMatcher } from "./LogMatcher";
export declare const transformLogEntry: (matcher: string | LogMatcher) => (logEntry: LogEntry) => LogEntry;
