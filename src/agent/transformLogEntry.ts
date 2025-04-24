import { LogEntry } from "../type/LogEntry";
import { LogMatcher } from "./LogMatcher";


export const transformLogEntry = (matcher: string | LogMatcher) => (logEntry: LogEntry) => {
  if (typeof matcher === "string") {
    return logEntry;
  }
  if (matcher.transform) {
    return matcher.transform(logEntry);
  }
  return logEntry;
};
