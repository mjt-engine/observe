import { Timer } from "./Timer";
export type Stats = {
    addCount: (value: number) => void;
    clearCount: () => Stats;
    time: () => Timer;
    getCount: () => number;
    getTimers: () => Timer[];
    clearTimers: () => Stats;
};
export declare const Stats: (max?: number) => Stats;
