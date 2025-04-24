import { ObserveAgent } from "../agent/ObserveAgent";
import { Timer } from "../agent/Timer";
export type Observe = {
    span: (spanId: string) => Observe;
    counter: (name: string, number?: number) => Observe;
    timer: (name: string) => Timer;
    log: (message: string, ...extra: unknown[]) => Observe;
    end: () => Observe;
};
export declare const Observe: (traceId?: string, agent?: ObserveAgent) => Observe;
