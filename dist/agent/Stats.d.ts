import { Timer } from "./Timer";
export type Stats = {
    count: (value?: number) => void;
    counter: (name: string, value?: number) => void;
    clearCount: () => Stats;
    timer: (name: string) => Timer;
    time: () => Timer;
    getTimes: () => Timer[];
    getCount: () => number;
    getCounter: (name: string) => number;
    getCounters: () => Map<string, number>;
    getTimers: (name: string) => Timer[];
    clearTimers: (name: string) => Stats;
};
export declare const Stats: (max?: number) => Stats;
