import { Timer } from "./Timer";
export type Stats = {
    count: (value?: number) => void;
    increment: (name: string, value?: number) => void;
    gauge: (name: string, value?: number) => void;
    timer: (name: string) => Timer;
    time: () => Timer;
    lastTime: () => Timer | undefined;
    getTimes: () => Timer[];
    getCount: () => number;
    getCounter: (name: string) => number;
    getCounters: () => Map<string, number>;
    getGauge: (name: string) => number;
    getGauges: () => Map<string, number>;
    getTimers: (name: string) => Timer[];
    clear: () => Stats;
};
export declare const Stats: (max?: number) => Stats;
