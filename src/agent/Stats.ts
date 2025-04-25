import { isDefined } from "@mjt-engine/object";
import { MaxLengthArray } from "./MaxLengthArray";
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

export const Stats = (max = 100): Stats => {
  let count = 0;
  const counters = new Map<string, number>();
  const gauges = new Map<string, number>();
  const timers = new Map<string, MaxLengthArray<Timer>>();
  const times = MaxLengthArray<Timer>(max);

  const mod: Stats = {
    clear: () => {
      count = 0;
      counters.clear();
      gauges.clear();
      timers.clear();
      times.clear();
      return mod;
    },
    lastTime: () => {
      return times.last();
    },
    time: () => {
      const last = mod.lastTime();
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
    increment: (name: string, value: number = 1) => {
      const current = counters.get(name) ?? 0;
      counters.set(name, current + value);
    },
    gauge: (name: string, value: number = 1) => {
      const current = gauges.get(name) ?? 0;
      gauges.set(name, current + value);
    },
    getCounters: () => {
      return new Map(counters);
    },
    getCounter: (name: string) => {
      return counters.get(name) ?? 0;
    },
    getGauge: (name: string) => {
      return gauges.get(name) ?? 0;
    },
    getGauges: () => {
      return new Map(gauges);
    },
    count: (value: number = 1) => {
      count += value;
    },
    getCount: () => {
      return count;
    },
    getTimers: (name) => {
      const ts = timers.get(name) ?? MaxLengthArray(max);
      return ts.get();
    },
  };
  return mod;
};
