import { TraceId } from "./TraceId";
export type LogEntry = {
    message: string;
    traceId: TraceId;
    timestamp?: number;
    extra?: unknown[];
};
