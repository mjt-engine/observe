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

export const Observe = (
  traceId: string = "",
  agent: ObserveAgent = ObserveAgent()
) => {
  agent.start(traceId);
  const mod: Observe = {
    span: (spanId) => Observe(`${traceId}.${spanId}`, agent),
    increment: (name, count = 1) => {
      agent.getStats(traceId).increment(name, count);
      return mod;
    },
    sample: (probability, name, fn) => {
      if (Math.random() < probability) {
        const value = fn();
        mod.gauge(name, value);
      }
      return mod;
    },
    when: (filter, name, fn) => {
      if (filter()) {
        const value = fn();
        mod.gauge(name, value);
      }
      return mod;
    },
    gauge: (name, value) => {
      agent.getStats(traceId).gauge(name, value);
      return mod;
    },
    timer: (name) => {
      return agent.getStats(traceId).timer(name);
    },
    end: () => {
      agent.end(traceId);
      return mod;
    },
    log: (message, ...extra) => {
      agent.log({ traceId, message, extra });
      return mod;
    },
  };

  return mod;
};
