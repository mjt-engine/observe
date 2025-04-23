import { ObserveAgent } from "./ObserveAgent";
export type Observe = {
    span: (spanId: string) => Observe;
    log: (message: string, ...extra: unknown[]) => Observe;
    end: () => Observe;
};
export declare const Observe: (traceId?: string, agent?: ObserveAgent) => Observe;
