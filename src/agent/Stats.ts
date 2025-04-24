import { isDefined } from "@mjt-engine/object";
import { MaxLengthArray } from "./MaxLengthArray";
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

export const Stats = (max = 100): Stats => {
  let count = 0;
  const counters = new Map<string, number>();
  const timers = new Map<string, MaxLengthArray<Timer>>();
  const times = MaxLengthArray<Timer>(max);

  const mod: Stats = {
    time: () => {
      const last = times.last();
      if (isDefined(last)) {
        last.end();
      }
      const timer = Timer();
      times.push(timer);
      return timer;
    },
    getTimes: () => {
      return times.get();
    },
    timer: (name) => {
      const ts = timers.get(name) ?? MaxLengthArray(max);
      timers.set(name, ts);
      const timer = Timer();
      ts.push(timer);
      return timer;
    },
    counter: (name: string, value: number = 1) => {
      const current = counters.get(name) ?? 0;
      counters.set(name, current + value);
    },
    getCounters: () => {
      return new Map(counters);
    },
    getCounter: (name: string) => {
      return counters.get(name) ?? 0;
    },
    count: (value: number = 1) => {
      count += value;
    },
    getCount: () => {
      return count;
    },
    clearCount: () => {
      count = 0;
      return mod;
    },
    getTimers: (name) => {
      const ts = timers.get(name) ?? MaxLengthArray(max);
      return ts.get();
    },
    clearTimers: (name) => {
      const ts = timers.get(name) ?? MaxLengthArray(max);
      ts.clear();
      return mod;
    },
  };
  return mod;
};
