import { ObserveAgent } from "../agent/ObserveAgent";
import { Timer } from "../agent/Timer";
export type Observe = {
    span: (spanId: string) => Observe;
    increment: (name: string, count?: number) => Observe;
    gauge: (name: string, value: number) => Observe;
    timer: (name: string) => Timer;
    sample: (probability: number, name: string, fn: () => number) => Observe;
    when: (filter: () => boolean, name: string, fn: () => number) => Observe;
    log: (message: string, ...extra: unknown[]) => Observe;
    end: () => Observe;
};
export declare const Observe: (traceId?: string, agent?: ObserveAgent) => Observe;
