import { ObserveAgent } from "../agent/ObserveAgent";
import { Timer } from "../agent/Timer";
export type Observe = {
    span: (spanId: string) => Observe;
    count: (number?: number) => Observe;
    time: () => Timer;
    log: (message: string, ...extra: unknown[]) => Observe;
    end: () => Observe;
};
export declare const Observe: (traceId?: string, agent?: ObserveAgent) => Observe;
