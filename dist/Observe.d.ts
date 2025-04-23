import { TraceId } from "./TraceId";
export type Observe = {
    span: (spanName: string) => Observe;
    log: (message: string, ...extra: unknown[]) => Observe;
    end: () => Observe;
};
export type ObserveAgent = {
    start: (traceId: TraceId) => void;
    addLog: (traceId: TraceId, message: string, ...extra: unknown[]) => void;
    end: (traceId: TraceId) => void;
};
export declare const ObserveAgent: () => ObserveAgent;
export declare const Observe: (name?: string, agent?: ObserveAgent) => Observe;
